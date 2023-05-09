#!/bin/bash

MYSHA=`podman build -q .`
echo $MYSHA
# # podman run --rm -it $MYSHA
podman tag $MYSHA cr/project(or ns)/repo:tag
podman push --tls-verify=false cr/project(or ns)/repo:tag

# To Be Tested
# # oc apply -f deployment.yaml
# # oc delete -f deployment.yaml