
docker build -t barteks/simple-helm .

Change barteks into your Docker Hub username.

Then you can check your docker with:

docker run -p 8080:8080 --rm -it barteks/simple-helm
Now push the docker to Docker Hub

docker push barteks/simple-helm


minikube start
kubectl create deployment simple-helm --image=barteks/simple-helm
kubectl expose deployment simple-helm --type=LoadBalancer --port=8080
minikube service simple-helm



kubectl apply -f deployment.yaml

Clean
kubectl delete service simple-helm
kubectl delete deployment simple-helm




## my steps

### References
- https://cloud.redhat.com/blog/getting-started-helm-openshift
- https://www.ibm.com/cloud/blog/deploying-helm-charts-on-openshift
- https://bartek-blog.github.io/kubernetes/helm/python/fastapi/2020/12/13/helm.html

oc new-project <project name>
oc project <project name>