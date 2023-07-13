#!/bin/bash
echo "Use bash, does not work with windows command prompt or powershell"

MYSHA=`podman build -q .`
echo $MYSHA
# # podman run --rm -it $MYSHA
podman tag $MYSHA cr/project(or ns)/repo:tag
podman push --tls-verify=false cr/project(or ns)/repo:tag

# # oc apply -f job.yaml
# # oc delete -f job.yaml