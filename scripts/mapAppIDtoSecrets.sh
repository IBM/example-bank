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

# Grabs appid-example-bank instance and gets api key and management url from appid-example-bank-credentials
credentials=$(ibmcloud resource service-keys --instance-name appid-example-bank --output JSON | jq -c '[ .[] | select( .name | contains("appid-example-bank-credentials")) ]' | jq -j '.[0].credentials')
APIKEY=$(echo "${credentials}" | jq -j '.apikey')
MGMTEP=$(echo "${credentials}" | jq -j '.managementUrl')
echo $APIKEY
echo $MGMTEP

response=$(curl -k -v -X POST -w "\n%{http_code}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  --data-urlencode "grant_type=urn:ibm:params:oauth:grant-type:apikey" \
  --data-urlencode "apikey=$APIKEY" \
  "https://iam.cloud.ibm.com/identity/token")

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "200" ] && exit 1

accesstoken=$(echo "${response}" | head -n1 | jq -j '.access_token')

response=$(curl -v -X GET -w "\n%{http_code}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $accesstoken" \
  $MGMTEP/applications)

echo $response

code=$(echo "${response}" | tail -n1)
[ "$code" -ne "200" ] && exit 1

tenantid=$(echo "${response}"| head -n1 | jq -j '.applications[0].tenantId')
clientid=$(echo "${response}"| head -n1 | jq -j '.applications[0].clientId')
secret=$(echo "${response}"| head -n1 | jq -j '.applications[0].secret')
oauthserverurl=$(echo "${response}"| head -n1 | jq -j '.applications[0].oAuthServerUrl')
appidhost=$(echo "${oauthserverurl}" | awk -F/ '{print $3}')

# Creates secret from application credentials

oc create secret generic bank-oidc-secret --from-literal=OIDC_JWKENDPOINTURL=$oauthserverurl/publickeys --from-literal=OIDC_ISSUERIDENTIFIER=$oauthserverurl --from-literal=OIDC_AUDIENCES=$clientid

oc create secret generic bank-appid-secret --from-literal=APPID_TENANTID=$tenantid --from-literal=APPID_SERVICE_URL=https://$appidhost

oc create secret generic bank-iam-secret --from-literal=IAM_APIKEY=$APIKEY --from-literal=IAM_SERVICE_URL=https://iam.cloud.ibm.com/identity/token

oc create secret generic mobile-simulator-secrets \
  --from-literal=APP_ID_IAM_APIKEY=$APIKEY \
  --from-literal=APP_ID_MANAGEMENT_URL=$MGMTEP \
  --from-literal=APP_ID_CLIENT_ID=$clientid \
  --from-literal=APP_ID_CLIENT_SECRET=$secret \
  --from-literal=APP_ID_TOKEN_URL=$oauthserverurl \
  --from-literal=PROXY_USER_MICROSERVICE=user-service:9080 \
  --from-literal=PROXY_TRANSACTION_MICROSERVICE=transaction-service:9080