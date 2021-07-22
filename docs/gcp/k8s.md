# Google CLoud Kubernetes (WORK IN PROGRESS)

References
- https://cloud.google.com/kubernetes-engine/docs/quickstarts/deploying-a-language-specific-app
- https://cloud.google.com/kubernetes-engine/docs/how-to
- https://cloud.google.com/kubernetes-engine/docs/tutorials

- https://codelabs.developers.google.com/codelabs/cloud-hello-kubernetes
- https://levelup.gitconnected.com/dockerizing-deploying-and-scaling-node-js-on-google-kubernetes-engine-with-continuous-integration-f895a98bf6e3
- https://itnext.io/deploying-a-node-js-app-to-the-google-kubernetes-engine-gke-d6af1f3a954c
- https://github.com/GoogleCloudPlatform/kubernetes-engine-samples

Use cloud shell or local gcloud CLI

git clone https://github.com/GoogleCloudPlatform/kubernetes-engine-samples.git
cd kubernetes-engine-samples/hello-app

## need to install kubeclt?

gcloud components install kubectl

# set project ID and compute zone

gcloud config set project $PROJECT_ID
gcloud config set compute/zone asia-southeast1-b

# create docker image

export PROJECT_ID=[PROJECT_ID]
docker build -t gcr.io/${PROJECT_ID}/hello-app:v1 .

# run locally & test

docker run --rm -p 8080:8080 gcr.io/${PROJECT_ID}/hello-app:v1
? curl http://localhost:8080

# enable container registry and push to it

gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/hello-app:v1

# create cluster

```bash
gcloud container clusters create hello-cluster --num-nodes=1
#  --disk-size 10 --num-nodes 1 --enable-autoscaling --min-nodes 1 --max-nodes 3 --zone us-central1-a
#  --machine-type n1-standard-1 \
## ? gcloud compute instances list
```

# reserve IP address

```bash
gcloud compute addresses create gke-tutorial-ip
gcloud compute instances list
```


```bash
# create deployment
kubectl create deployment hello-web --image=gcr.io/${PROJECT_ID}/cookbook:latest --port 8080
kubectl get pods
# expose to internet
kubectl expose deployment hello-web --type=LoadBalancer --port 80 --target-port 8080
kubectl get service
# scaling
kubectl scale deployment hello-web --replicas=3
kubectl get deployment hello-web
# query
kubectl get deployment hello-web
kubectl get pods

# update & deploy new version
docker build -t gcr.io/${PROJECT_ID}/hello-app:v2 .
docker push gcr.io/${PROJECT_ID}/hello-app:v2
kubectl set image deployment/hello-web hello-app=gcr.io/${PROJECT_ID}/hello-app:v2
kubectl rollout status deployment hello-node # check rollout
```


# cleaning up

kubectl delete service hello-web
gcloud container clusters delete hello-cluster


# https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer

- [web-deployment.yaml](../../js-node/wip/k8s/web-deployment.yaml)
- [web-service.yaml](../../js-node/wip/k8s/web-service.yaml)
- [ingress-basic.yaml](../../js-node/wip/k8s/ingress-basic.yaml)
- [compute-address.yaml](../../js-node/wip/k8s/compute-address.yaml)
- [web-deployment2.yaml](../../js-node/wip/k8s/web-deployment2.yaml)
- [web-service2.yaml](../../js-node/wip/k8s/web-service2.yaml)
- [ingress-fanout.yaml](../../js-node/wip/k8s/ingress-fanout.yaml)


```bash
kubectl apply -f web-deployment.yaml
kubectl apply -f web-service.yaml
kubectl apply -f ingress-basic.yaml
kubectl get ingress ingress-basic
# OPTION STATIC IP ADDRESS
# kubectl apply -f compute-address.yaml
# kubectl apply -f ingress-basic.yaml # with the computed address

# multiple apps
kubectl apply -f web-deployment-v2.yaml
kubectl apply -f web-service2.yaml
kubectl apply -f ingress-fanout.yaml
kubectl get ingress ingress-fanout

# deletion
kubectl delete ingress ingress-basic
kubectl delete ingress ingress-fanout
# kubectl delete service hello-web
gcloud compute addresses delete gke-static-ip --global
gcloud container clusters delete [cluster-name] # delete cluster and deployments

# other commands - need to test
kubectl get services
kubectl cluster-info
kubectl config view
kubectl get events
kubectl logs <pod-name>
kubectl get deployments
```