https://levelup.gitconnected.com/dockerizing-deploying-and-scaling-node-js-on-google-kubernetes-engine-with-continuous-integration-f895a98bf6e3

# Google CLoud Kubernetes (WORK IN PROGRESS)

K8S https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app

Use cloud shell or local gcloud CLI

git clone https://github.com/GoogleCloudPlatform/kubernetes-engine-samples
cd kubernetes-engine-samples/hello-app

# create docker image

export PROJECT_ID=[PROJECT_ID]
docker build -t gcr.io/${PROJECT_ID}/hello-app:v1 .
? docker images


# enable container registry and push to it

gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/hello-app:v1

# run locally & test

docker run --rm -p 8080:8080 gcr.io/${PROJECT_ID}/hello-app:v1
? curl http://localhost:8080

# set project ID and compute engine zone

## need to install kubeclt?
gcloud components install kubectl

* gcloud config set project $PROJECT_ID
* gcloud config set compute/zone [COMPUTE_ENGINE_ZONE]

* gcloud container clusters create hello-cluster --num-nodes=2

? gcloud compute instances list

# create deployment

kubectl create deployment hello-web --image=gcr.io/${PROJECT_ID}/hello-app:v1

kubectl get pods

# expose to internet

kubectl expose deployment hello-web --type=LoadBalancer --port 80 --target-port 8080

kubectl get service


# scaling

kubectl scale deployment hello-web --replicas=3

# query

kubectl get deployment hello-web
kubectl get pods


# update version

docker build -t gcr.io/${PROJECT_ID}/hello-app:v2 .
docker push gcr.io/${PROJECT_ID}/hello-app:v2
kubectl set image deployment/hello-web hello-app=gcr.io/${PROJECT_ID}/hello-app:v2


# cleaning up

kubectl delete service hello-web
gcloud container clusters delete hello-cluster


# https://cloud.google.com/kubernetes-engine/docs/tutorials/http-balancer

[web-deployment.yaml](../example-app/config/k8s/web-deployment.yaml)

kubectl apply -f web-deployment.yaml

---

[web-service.yaml](../example-app/config/k8s/web-service.yaml)

kubectl apply -f web-service.yaml

---

[ingress-basic.yaml](../example-app/config/k8s/ingress-basic.yaml)

kubectl apply -f ingress-basic.yaml
kubectl get ingress ingress-basic

---

OPTION STATIC IP ADDRESS

[compute-address.yaml](../example-app/config/k8s/compute-address.yaml)

kubectl apply -f compute-address.yaml
kubectl apply -f basic-ingress.yaml # with the computed address

---

MULTIPLE APPS ON A LB

[web-deployment2.yaml](../example-app/config/k8s/web-deployment2.yaml)

kubectl apply -f web-deployment-v2.yaml

[web-service2.yaml](../example-app/config/k8s/web-service2.yaml)

kubectl apply -f web-service2.yaml

[ingress-fanout.yaml](../example-app/config/k8s/ingress-fanout.yaml)

kubectl apply -f ingress-fanout.yaml

kubectl get ingress ingress-fanout

---

# DELETION

kubectl delete ingress ingress-basic
kubectl delete ingress ingress-fanout
gcloud compute addresses delete gke-static-ip --global

Delete the cluster: This deletes the compute nodes of your container cluster and other resources such as the Deployments in the cluster:

gcloud container clusters delete loadbalancedcluster







```bash
export PROJECT_ID=project-id
docker build -t gcr.io/${PROJECT_ID}/vue-crud-x:latest .
gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/vue-crud-x:latest

gcloud config set project $PROJECT_ID
gcloud config set compute/zone compute-zone

# Submit image to container registry
# gcloud builds submit --tag gcr.io/<project-id>/gke-tutorial-image .

# create K8s cluster
gcloud container clusters create hello-cluster --num-nodes=1
#  --disk-size 10 --num-nodes 1 --enable-autoscaling --min-nodes 1 --max-nodes 5 --zone us-central1-a

# reserve IP address
gcloud compute addresses create gke-tutorial-ip
```

gcloud compute instances list

kubectl create deployment hello-web --image=gcr.io/${PROJECT_ID}/vue-crud-x:latest
kubectl get pods


kubectl expose deployment hello-web --type=LoadBalancer --port 80 --target-port 8080
kubectl get service
kubectl scale deployment hello-web --replicas=3
kubectl get deployment hello-web

# deploy new version
docker build -t gcr.io/${PROJECT_ID}/hello-app:v2 .
docker push gcr.io/${PROJECT_ID}/hello-app:v2
kubectl set image deployment/hello-web hello-app=gcr.io/${PROJECT_ID}/hello-app:v2

# cleanup
kubectl delete service hello-web
gcloud container clusters delete hello-cluster



https://itnext.io/deploying-a-node-js-app-to-the-google-kubernetes-engine-gke-d6af1f3a954c