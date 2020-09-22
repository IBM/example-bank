echo "Creating OpenShift Serverless operator"

cat <<EOF | oc apply -f -
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: serverless-operator
  namespace: openshift-operators 
spec:
  channel: "4.5"
  name: serverless-operator
  source: redhat-operators 
  sourceNamespace: openshift-marketplace
EOF
sleep 5

echo "Creating Knative Serving component"
oc create namespace knative-serving
cat <<EOF | oc apply -f -
apiVersion: operator.knative.dev/v1alpha1
kind: KnativeServing
metadata:
    name: knative-serving
    namespace: knative-serving
EOF
# sleep 3
# oc get knativeserving.operator.knative.dev/knative-serving -n knative-serving --template='{{range .status.conditions}}{{printf "%s=%s\n" .type .status}}{{end}}'
# echo "."
# echo "."
# echo "######################################################"
# echo "Execute this command to check Knative Serving status: "
# echo "oc get knativeserving.operator.knative.dev/knative-serving -n knative-serving --template='{{range .status.conditions}}{{printf \"%s=%s\\\n\" .type .status}}{{end}}'"
# echo "######################################################"
# echo "When the status of everything is TRUE, you can now deploy Knative Services"
sleep 5
echo "##################"
echo "Waiting for Knative Serving to be up"

while [ $(oc get knativeserving.operator.knative.dev/knative-serving -n knative-serving --template='{{range .status.conditions}}{{printf "%s=%s\n" .type .status}}{{end}}' | grep -c True) -ne 4 ]; do
    echo "##################"
    echo "Status: "
    oc get knativeserving.operator.knative.dev/knative-serving -n knative-serving --template='{{range .status.conditions}}{{printf "%s=%s\n" .type .status}}{{end}}'
    echo "##################"
    echo "Waiting for Knative Serving to be up"
    sleep 5
done

echo "OpenShift Serverless with Knative Serving is ready to be used!"