MGMTEP=$1
APIKEY=$2

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

oc create secret generic bank-oidc-adminuser --from-literal=APP_ID_ADMIN_USER=bankadmin --from-literal=APP_ID_ADMIN_PASSWORD=password

oc create secret generic bank-db-secret --from-literal=DB_SERVERNAME=creditdb --from-literal=DB_PORTNUMBER=5432 --from-literal=DB_DATABASENAME=example --from-literal=DB_USER=postgres --from-literal=DB_PASSWORD=postgres
