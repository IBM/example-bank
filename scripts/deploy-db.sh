#!/bin/sh
echo "Deploying PostgreSQL 1/3"
kubectl apply -f pg_csv.yaml -f pg_sub.yaml -f pg_operatorgroup.yaml 
echo "Deploying PostgreSQL 2/3"
sleep 5
kubectl apply -f pg_deploy.yaml
echo "Deploying PostgreSQL 2/3"
sleep 3
kubectl apply -f creditdb.yaml
