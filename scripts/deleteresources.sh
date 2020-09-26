#!/bin/bash -x

# Clean up clusters after lab one for the cloud native security conference

# ibmcloud login --apikey ${APIKEY} -c ${ACCOUNT}

ibmcloud ks clusters | egrep "^${CLUSTER_NAME_PREFIX}" | awk '{print $2}'
for CLUSTER in $(ibmcloud ks clusters | egrep "^${CLUSTER_NAME_PREFIX}" | awk '{print $2}')
do
    echo $CLUSTER
    ibmcloud ks cluster config --cluster $CLUSTER --admin
    clustername=$(oc config current-context | tr "/" " " | awk '{print $1}')

    # Delete resources before removing namespace
    oc delete all --all -n example-bank
    sleep 2

    ## begin delete openshift serverless
    # delete knative-serving component
    oc delete knativeservings.operator.knative.dev knative-serving -n knative-serving
    oc delete namespace knative-serving --wait=false
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

    ## delete pipeline workshop

    oc delete all --all -n bank-infra

    oc delete project bank-infra
    
    ## delete openshift pipeline resources

    oc delete all --all -n openshift-pipelines

    oc delete namespace openshift-pipelines

    ## Delete jaeger,elasticsearch,kialia,servicemesh operators

    oc delete csv -n openshift-operators $(oc get csv -n openshift-operators -o=jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' | grep 'elasticsearch-operator\|jaeger-operator\|kiali-operator\|servicemeshoperator\|openshift-pipelines-operator')

    ## print resources and save as txt file
    # echo "CLUSTER ID ${CLUSTER} - ${clustername}" >> resources.txt
    # echo "Pods in default namespace: " >> resources.txt
    # oc get pods -n default >> resources.txt
    # echo "All in example-bank namespace: " >> resources.txt
    # oc get all -n example-bank >> resources.txt
    # echo "All in bank-infra namespace: " >> resources.txt
    # oc get all -n bank-infra >> resources.txt
    # echo "All in istio-system namespace: " >> resources.txt
    # oc get all -n istio-system >> resources.txt
    # echo "All in openshift-pipelines namespace: " >> resources.txt
    # oc get all -n openshift-pipelines >> resources.txt
    # echo "-------------------------------------" >> resources.txt
done