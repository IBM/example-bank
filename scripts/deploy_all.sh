#!/bin/sh
# Requires secrets to have been created for App Id, mobile simulator and the database.

# Run data model load. This is idempotent, find if schema is already loaded.
oc apply -f data_model/job.yaml

# Front-end and back-end services, and the data cleanup job.
oc apply -f deployment.yaml -f bank-app-backend/transaction-service/deployment.yaml -f bank-app-backend/user-service/deployment.yaml -f bank-user-cleanup-utility/job.yaml

