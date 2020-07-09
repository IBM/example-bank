
## Building individual microservices

### User service

```
mvn -pl :user-service -am package
docker build -t user-service:1.0-SNAPSHOT user-service
```

### Transaction service
```
mvn -pl :transaction-service -am package
docker build -t transaction-service:1.0-SNAPSHOT transaction-service
```


## Configuration

### Secrets

```
kubectl create secret generic bank-db-secret --from-literal=DB_SERVERNAME=<host> --from-literal=DB_PORTNUMBER=<port> --from-literal=DB_DATABASENAME=ibmclouddb --from-literal=DB_USER=<user> --from-literal=DB_PASSWORD=<password>
kubectl create secret generic bank-oidc-secret --from-literal=OIDC_JWKENDPOINTURL=<oauthServerUrl>/publickeys --from-literal=OIDC_ISSUERIDENTIFIER=<issuer> --from-literal=OIDC_AUDIENCES=<audience>
```


## Curl commands

### Users

```
curl -X POST -H "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"consentGiven\": \"true\"}" -k https://localhost:9443/bank/v1/users

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9443/bank/v1/users/self

curl -X PUT "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"consentGiven\": \"false\"}" -k https://localhost:9443/bank/v1/users/self

curl -X DELETE "Authorization: Bearer <access-token>" -k https://localhost:9443/bank/v1/users/self
```


### User Events

```
curl -X POST "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"eventId\": \"871859e4-9fca-4bcf-adb5-e7d063d0747e\"}" -k https://localhost:9443/bank/v1/userEvents

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9443/bank/v1/userEvents/self

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9443/bank/v1/userEvents/self/info
```


### Events

```
curl -X POST "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"eventName\": \"Event name\", \"pointValue\": 100}" -k https://localhost:9444/bank/v1/events

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9444/bank/v1/events/{eventId}

curl -X PUT "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"eventName\": \"Event name\", \"pointValue\": 100}" -k https://localhost:9444/bank/v1/events/{eventId}

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9444/bank/v1/events

curl -X GET "Authorization: Bearer <access-token>" -k "https://localhost:9444/bank/v1/events?id=&id=&id="

```

## Running the integration tests

### Set environment variables

Base URL where users and events services are deployed
```
export USERS_BASEURL=http://<host>:<port>
export EVENTS_BASEURL=http://<host>:<port>
```

Prefix for test user names and the password they should use.  These users are created dynamically by the tests.
```
export TEST_USER_PREFIX=<testUsername>
export TEST_PASSWORD=<testUserPassword>
```

Admin user name and password.  This user name must exist in App Id prior to running the test and must have the admin role.
```
export TEST_ADMIN_USER=<adminUsername>
export TEST_ADMIN_PASSWORD=<adminUserPassword>
```

App Id service URL.  Change to correct URL for the region where your App Id instance is deployed.
```
export APPID_SERVICE_URL=https://us-south.appid.cloud.ibm.com
```

App Id tenant id, client id, and client password (secret)
```
export APPID_TENANTID=<tenant id>
export OIDC_CLIENTID=<client id>
export OIDC_CLIENTPASSWORD=<client secret>
export OIDC_ISSUERIDENTIFIER=%APPID_SERVICE_URL%/%APPID_TENANTID%
```

IAM API key (needed for authentication to App Id)
```
export IAM_APIKEY=<apikey>
export IAM_SERVICE_URL=https://iam.cloud.ibm.com/identity/token
```


### Run the tests

```
mvn -pl :integration-tests -am verify
```