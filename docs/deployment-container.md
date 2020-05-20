# Docker

## Backend Application

Reference - https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

From vue-crud-x folder (replace **ais-one/node-web-app** with your own image name)

```
# build the container
docker build -t ais-one/node-web-app:latest -f example-app/Dockerfile . 

## NOT USED: docker run -it -d ais-one/node-web-app /bin/bash
# run the container
docker run -p 3000:3000 -p 3001:3001 -d ais-one/node-web-app

# check running container id
docker ps

# to check logs
docker logs <container id>
```

To access container command line

```
docker exec -it <container id> /bin/bash
```

# docker build -t <your username>/node-web-app .
# OR
# docker build -t node-web-app .
# docker run -p 49160:8080 -d <your username>/node-web-app

# Example
Running on http://localhost:3000

docker container ls -a
docker container rm <contianer>
docker container run <contianer>
docker container stop <contianer>
docker container start <contianer>
docker container port
docker container prune
docker image ls
docker image rm <image>


docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -q)


export PROJECT_ID=project-id
docker build -t gcr.io/${PROJECT_ID}/vue-crud-x:latest .
gcloud auth configure-docker
docker push gcr.io/${PROJECT_ID}/vue-crud-x:latest

gcloud config set project $PROJECT_ID
gcloud config set compute/zone compute-zone

gcloud container clusters create hello-cluster --num-nodes=2
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
