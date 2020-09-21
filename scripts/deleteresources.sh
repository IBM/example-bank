#!/bin/bash -x



# Delete resources before removing namespace
oc delete all --all -n example-bank
sleep 2

## begin delete openshift serverless
# delete knative-serving component
oc delete knativeservings.operator.knative.dev knative-serving -n knative-serving
oc delete namespace knative-serving
oc delete knativeeventings.operator.knative.dev knative-eventing -n knative-eventing
oc delete namespace knative-eventing

# delete subscription and clusterserviceversion of openshift serverless operator
oc delete subscription serverless-operator -n openshift-operators
oc delete csv $(oc get csv -n openshift-operators -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | grep serverless-operator) -n openshift-operators

## end of delete openshift serverless


# Service mesh cleanup

oc delete smcp --all -n istio-system
oc delete smmr --all -n istio-system


oc delete validatingwebhookconfiguration/openshift-operators.servicemesh-resources.maistra.io
oc delete mutatingwebhookconfigurations/openshift-operators.servicemesh-resources.maistra.io
oc delete -n openshift-operators daemonset/istio-node
oc delete clusterrole/istio-admin clusterrole/istio-cni clusterrolebinding/istio-cni
oc delete subs --all --all-namespaces
oc get crds -o name | grep '.*\.istio\.io' | xargs -r -n 1 oc delete
oc get crds -o name | grep '.*\.maistra\.io' | xargs -r -n 1 oc delete
oc get crds -o name | grep '.*\.kiali\.io' | xargs -r -n 1 oc delete

oc delete all --all -n istio-system
sleep 2

## Delete projects

oc delete project example-bank
oc delete project istio-system

## Delete jaeger,elasticsearch,kialia,servicemesh operators

oc delete csv -n openshift-operators $(oc get csv -n openshift-operators -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | grep 'elasticsearch-operator\|jaeger-operator\|kiali-operator\|servicemeshoperator')