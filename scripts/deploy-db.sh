#!/bin/sh
kubectl apply -f pg_csv.yaml -f pg_sub.yaml -f pg_operatorgroup.yaml -f pg_deploy.yaml -f creditdb.yaml
