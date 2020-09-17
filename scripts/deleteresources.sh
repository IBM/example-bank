#!/bin/bash

## begin delete openshift serverless

# delete knative-serving component
oc delete knativeservings.operator.knative.dev knative-serving -n knative-serving
oc delete namespace knative-serving
oc delete knativeeventings.operator.knative.dev knative-eventing -n knative-eventing
oc delete namespace knative-eventing

# delete subscription and clusterserviceversion of openshift serverless operator
oc delete subscription serverless-operator -n openshift-operators
oc delete csv $(oc get csv -n openshift-operators -o=jsonpath='{.items[*].metadata.name}' | grep serverless) -n openshift-operators

## end of delete openshift serverless




## this should delete example bank resources
oc delete project example-bank