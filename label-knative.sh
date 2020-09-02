#!/bin/bash
oc label namespace knative-serving serving.knative.openshift.io/system-namespace=true --overwrite
oc label namespace knative-serving-ingress serving.knative.openshift.io/system-namespace=true --overwrite
