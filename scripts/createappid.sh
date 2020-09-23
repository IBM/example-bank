# Check if ibmcloud is in user's account
ibmcloud_accountname=$(ibmcloud target --output json | jq -j '.account.name')

## check if account is in quicklabs (labs.cognitiveclass.ai) or workshop clusters account in DEG
if [ "$ibmcloud_accountname" = "QuickLabs - IBM Skills Network" ]; then
  echo "\n"
  echo "WARNING: You're logged in as ${ibmcloud_accountname}"
  echo "Please log in again using -- ibmcloud login -u YOUR_IBM_CLOUD_EMAIL"
  echo "and run this script again"
  exit 1
elif [ "$ibmcloud_accountname" = "DEGCloud DEGCloud's Account" ]; then
  echo "\n"
  echo "WARNING: You're logged in as ${ibmcloud_accountname}"
  echo "Please log in again using -- ibmcloud login -u YOUR_IBM_CLOUD_EMAIL"
  echo "and run this script again"
  exit 1
fi
# end check


RG=$(ibmcloud resource groups --default | grep -i ^default | awk '{print $1}')
ibmcloud target -g $RG

ibmcloud resource service-instance appid-example-bank
if [ "$?" -ne "0" ]; then
  ibmcloud resource service-instance-create appid-example-bank appid lite us-south
fi

ibmcloud resource service-key appid-example-bank-credentials
if [ "$?" -ne "0" ]; then
  ibmcloud resource service-key-create appid-example-bank-credentials Writer --instance-name appid-example-bank
fi

credentials=$(ibmcloud resource service-key appid-example-bank-credentials)

mgmturl=$(echo "$credentials" | awk '/managementUrl/{ print $2 }')
apikey=$(echo "$credentials" | awk '/apikey/{ print $2 }')

iamtoken=$(ibmcloud iam oauth-tokens | awk '/IAM/{ print $3" "$4 }')

printf "\nSetting cloud directory options\n"
response=$(curl -X PUT -w "\n%{http_code}" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: $iamtoken" \
  -d '{
       "isActive":true,
       "config":
       {
           "selfServiceEnabled":true,
           "interactions":
           {
               "identityConfirmation":
               {
                   "accessMode":"OFF",
                   "methods":    ["email"]
               },
               "welcomeEnabled":true,
               "resetPasswordEnabled":true,
               "resetPasswordNotificationEnable":true
           },
           "signupEnabled":true,
           "identityField":"userName"
       }
     }' \
  "${mgmturl}/config/idps/cloud_directory")

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "200" ] && printf "\nFAILED to set cloud directory options\n" && exit 1

printf "\nCreating application\n"
response=$(curl -X POST -w "\n%{http_code}" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: $iamtoken" \
  -d '{"name": "mobile-simulator", "type": "regularwebapp"}' \
  "${mgmturl}/applications")
  
echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "200" ] && printf "\nFAILED to create application\n" && exit 1

clientid=$(echo "${response}" | head -n1 | jq -j '.clientId')

printf "\nDefining admin scope\n"
response=$(curl -X PUT -w "\n%{http_code}" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: $iamtoken" \
  -d '{"scopes": ["admin"]}' \
  "${mgmturl}/applications/$clientid/scopes")

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "200" ] && printf "\nFAILED to define admin scope\n" && exit 1

printf "\nDefining admin role\n"
response=$(curl -X POST -w "\n%{http_code}"  \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: $iamtoken" \
  -d '{"name": "admin",
       "access": [ {"application_id": "'$clientid'", "scopes": [ "admin" ]} ]
     }' \
  "${mgmturl}/roles")

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "201" ] && printf "\nFAILED to define admin role\n" && exit 1

roleid=$(echo "${response}" | head -n1 | jq -j '.id')

printf "\nDefining admin user in cloud directory\n"
response=$(curl -X POST -w "\n%{http_code}" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: $iamtoken" \
  -d '{"emails": [
          {"value": "bankadmin@yopmail.com","primary": true}
        ],
       "userName": "bankadmin",
       "password": "password"
      }' \
  "${mgmturl}/cloud_directory/sign_up?shouldCreateProfile=true")

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "201" ] && printf "\nFAILED to define admin user in cloud directory\n" && exit 1

printf "\nGetting admin user profile\n"
response=$(curl -X GET -w "\n%{http_code}" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: $iamtoken" \
  "${mgmturl}/users?email=bankadmin@yopmail.com&dataScope=index")

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "200" ] && printf "\nFAILED to get admin user profile\n" && exit 1

userid=$(echo "${response}" | head -n1 | jq -j '.users[0].id')

printf "\nAdding admin role to admin user\n"
response=$(curl -X PUT -w "\n%{http_code}" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: $iamtoken" \
  -d '{"roles": { "ids": ["'$roleid'"]}}' \
  "${mgmturl}/users/$userid/roles")

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "200" ] && printf "\nFAILED to add admin role to admin user\n" && exit 1

printf "\nApp ID instance created and configured"
printf "\nManagement server: $mgmturl"
printf "\nApi key:           $apikey"
printf "\n"