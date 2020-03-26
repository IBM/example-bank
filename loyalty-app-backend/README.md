
## Building individual microservices

### User service

```
mvn -pl :user-service -am package
docker build -t loyalty-user-service:1.0-SNAPSHOT user-service
```

### Event service
```
mvn -pl :event-service -am package
docker build -t loyalty-event-service:1.0-SNAPSHOT event-service
```


## Configuration

### Secrets

```
kubectl create secret generic loyalty-db-secret --from-literal=DB_SERVERNAME=<host> --from-literal=DB_PORTNUMBER=<port> --from-literal=DB_DATABASENAME=ibmclouddb --from-literal=DB_USER=<user> --from-literal=DB_PASSWORD=<password>
kubectl create secret generic loyalty-oidc-secret --from-literal=OIDC_JWKENDPOINTURL=<oauthServerUrl>/publickeys --from-literal=OIDC_ISSUERIDENTIFIER=<issuer> --from-literal=OIDC_AUDIENCES=<audience>
```


## Curl commands

### Users

```
curl -X POST -H "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"consentGiven\": \"true\"}" -k https://localhost:9443/loyalty/v1/users

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9443/loyalty/v1/users/self

curl -X PUT "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"consentGiven\": \"false\"}" -k https://localhost:9443/loyalty/v1/users/self

curl -X DELETE "Authorization: Bearer <access-token>" -k https://localhost:9443/loyalty/v1/users/self
```


### User Events

```
curl -X POST "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"eventId\": \"871859e4-9fca-4bcf-adb5-e7d063d0747e\"}" -k https://localhost:9443/loyalty/v1/userEvents

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9443/loyalty/v1/userEvents/self

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9443/loyalty/v1/userEvents/self/info
```


### Events

```
curl -X POST "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"eventName\": \"Event name\", \"pointValue\": 100}" -k https://localhost:9444/loyalty/v1/events

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9444/loyalty/v1/events/{eventId}

curl -X PUT "Authorization: Bearer <access-token>" -H "Content-Type: application/json" -d "{\"eventName\": \"Event name\", \"pointValue\": 100}" -k https://localhost:9444/loyalty/v1/events/{eventId}

curl -X GET "Authorization: Bearer <access-token>" -k https://localhost:9444/loyalty/v1/events

curl -X GET "Authorization: Bearer <access-token>" -k "https://localhost:9444/loyalty/v1/events?id=&id=&id="

```