Enable Google Container API

gcloud config set compute/zone us-central1-f

gcloud container clusters create hello-world

git clone https://github.com/thesandlord/mongo-k8s-sidecar.git
cd ./mongo-k8s-sidecar/example/StatefulSet/


kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: fast
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd


kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
  name: slow
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-standard

This configuration creates a new StorageClass called "fast" that is backed by SSD volumes. The StatefulSet can now request a volume, and the StorageClass will automatically create it.


kubectl apply -f googlecloud_ssd.yaml


# Headless service

```yaml
apiVersion: v1
kind: Service
metadata:
 name: mongo
 labels:
   name: mongo
spec:
 ports:
 - port: 27017
   targetPort: 27017
 clusterIP: None # headless service
 selector:
   role: mongo
---
# Stateful Set
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
 name: mongo
spec:
 serviceName: "mongo"
 replicas: 3
 template:
   metadata:
     labels:
       role: mongo
       environment: test
   spec:
     terminationGracePeriodSeconds: 10
     containers:
       - name: mongo
         image: mongo
         command:
           - mongod
           - "--replSet"
           - rs0
           - "--smallfiles"
           - "--noprealloc"
         ports:
           - containerPort: 27017
         volumeMounts:
           - name: mongo-persistent-storage
             mountPath: /data/db
       - name: mongo-sidecar
         image: cvallance/mongo-k8s-sidecar
         env:
           - name: MONGO_SIDECAR_POD_LABELS
             value: "role=mongo,environment=test"
 volumeClaimTemplates:
 - metadata:
     name: mongo-persistent-storage
     annotations:
       volume.beta.kubernetes.io/storage-class: "fast"
   spec:
     accessModes: [ "ReadWriteOnce" ]
     resources:
       requests:
         storage: 100Gi
```

kubectl apply -f mongo-statefulset.yaml

kubectl get statefulset
kubectl get pods
kubectl exec -ti mongo-0 mongo
rs.conf()

kubectl scale --replicas=5 statefulset mongo
kubectl get pods
kubectl scale --replicas=3 statefulset mongo
kubectl get pods


Each pod in a StatefulSet backed by a Headless Service will have a stable DNS name. The template follows this format: <pod-name>.<service-name>

This means the DNS names for the MongoDB replica set are:

mongo-0.mongo
mongo-1.mongo
mongo-2.mongo
You can use these names directly in the connection string URI of your app.

In this case, the connection string URI would be:

"mongodb://mongo-0.mongo,mongo-1.mongo,mongo-2.mongo:27017/dbname_?"


# Cleanup

kubectl delete statefulset mongo
kubectl delete svc mongo
kubectl delete pvc -l role=mongo
gcloud container clusters delete "hello-world"