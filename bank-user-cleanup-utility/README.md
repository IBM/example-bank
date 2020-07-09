
## Build

```
mvn package
docker build -t bank-user-cleanup-utility:1.0-SNAPSHOT .
```

### Secrets

```
kubectl create secret generic bank-db-secret --from-literal=DB_SERVERNAME=48f106c1-94cb-4133-b99f-20991c91cb1a.bn2a2vgd01r3l0hfmvc0.databases.appdomain.cloud --from-literal=DB_PORTNUMBER=30389 --from-literal=DB_DATABASENAME=ibmclouddb --from-literal=DB_USER=ibm_cloud_0637cd24_8ac9_4dc7_b2d4_ebd080633f7f --from-literal=DB_PASSWORD=<password>
kubectl create secret generic bank-iam-secret --from-literal=IAM_APIKEY=<apikey> --from-literal=IAM_SERVICE_URL=https://iam.cloud.ibm.com/identity/token
kubectl create secret generic bank-appid-secret --from-literal=APPID_TENANTID=3d17f53d-4600-4f32-bb2c-207f4e2f6060 --from-literal=APPID_SERVICE_URL=https://us-south.appid.cloud.ibm.com
```