# K8S https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
# cloud shell or local gcloud CLI

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

web-deployment.yaml

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: web
  namespace: default
spec:
  selector:
    matchLabels:
      run: web
  template:
    metadata:
      labels:
        run: web
    spec:
      containers:
      - image: gcr.io/google-samples/hello-app:1.0
        imagePullPolicy: IfNotPresent
        name: web
        ports:
        - containerPort: 8080
          protocol: TCP
```

kubectl apply -f web-deployment.yaml

---

web-service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
  namespace: default
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    run: web
  type: NodePort
```

kubectl apply -f web-service.yaml

---

basic-ingress.yaml

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: basic-ingress
spec:
  backend:
    serviceName: web
    servicePort: 8080
```

kubectl apply -f basic-ingress.yaml


kubectl get ingress basic-ingress

---

OPTION STATIC IP ADDRESS

compute-address.yaml

```yaml
apiVersion: compute.cnrm.cloud.google.com/v1beta1
kind: ComputeAddress
metadata:
  name: web-static-ip
spec:
  location: global
```

kubectl apply -f compute-address.yaml

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: basic-ingress
  annotations:
    kubernetes.io/ingress.global-static-ip-name: "web-static-ip"
spec:
  backend:
    serviceName: web
    servicePort: 8080
```

kubectl apply -f basic-ingress.yaml

? kubectl get ingress basic-ingress

---

MULTIPLE APPS ON A LB


web-deployment-v2.yaml

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: web2
  namespace: default
spec:
  selector:
    matchLabels:
      run: web2
  template:
    metadata:
      labels:
        run: web2
    spec:
      containers:
      - image: gcr.io/google-samples/hello-app:2.0
        imagePullPolicy: IfNotPresent
        name: web2
        ports:
        - containerPort: 8080
          protocol: TCP
```

kubectl apply -f web-deployment-v2.yaml

web-service-v2.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web2
  namespace: default
spec:
  ports:
  - port: 8080
    protocol: TCP
    targetPort: 8080
  selector:
    run: web2
  type: NodePort
```

kubectl apply -f web-service-v2.yaml


fanout-ingress.yaml
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: fanout-ingress
spec:
  rules:
  - http:
      paths:
      - path: /*
        backend:
          serviceName: web
          servicePort: 8080
      - path: /v2/*
        backend:
          serviceName: web2
          servicePort: 8080
```

kubectl create -f fanout-ingress.yaml

? kubectl get ingress fanout-ingress

---

# DELETION


kubectl delete ingress basic-ingress
kubectl delete ingress fanout-ingress
gcloud compute addresses delete web-static-ip --global

Delete the cluster: This deletes the compute nodes of your container cluster and other resources such as the Deployments in the cluster:

gcloud container clusters delete loadbalancedcluster