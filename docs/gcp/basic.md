# Google Cloud Platform

## Install Google Cloud SDK

https://cloud.google.com/sdk/

gcloud
- gsutil (for Storage)
- kubectl (for kubernetes)
- etc.

https://cloud.google.com/storage/docs/gsutil_install

## Using Google Cloud SDK

### auth, change users, set projects, etc.

```bash
gcloud init

login: gcloud auth login
logout from all the accounts: gcloud auth revoke --all
logout from a specific account: gcloud auth revoke <your_account>

gcloud projects list

gcloud config set project [PROJECT_ID]

gcloud config set compute/zone [ZONE]

gcloud config list
```

### components

```
gcloud components list
gcloud components install [COMPONENT_ID] (e.g. kubectl)
gcloud components update
gcloud components remove [COMPONENT_ID]
```

## Add Users To Pooject

TBD

## Create Service Keys

TBD


## Using Service Keys

gcloud auth activate-service-account <service_key.client_email> --key-file=service_key.json



## Hosting Static Website on GCP

https://cloud.google.com/storage/docs/hosting-static-website

NAME                  TYPE     DATA
www.example.com       CNAME    c.storage.googleapis.com


Verify Domain ownership/control using TXT

gsutil rsync -R spa/dist gs://uat.mybot.live

give permissions to view for public

set website info index page, error page

gsutil web set -m index.html -e 404.html gs://www.example.com
gsutil rm -r gs://www.example.com


## Docker Build And Push To gcr.io

Prerequisites: Dockerfile prepared

See [../deployment/deployment-container.md#backend-application](../deployment/deployment-container.md#backend-application)

Reference:
- https://levelup.gitconnected.com/dockerizing-and-autoscaling-node-js-on-google-cloud-ef8db3b99486
- https://codelabs.developers.google.com/codelabs/cloud-running-a-nodejs-container
- https://github.com/GoogleCloudPlatform/nodejs-docs-samples.git (nodejs-docs-samples/containerengine/hello-world)

```bash
# If using Cloud Build - https://console.cloud.google.com/cloud-build
# gcloud builds submit --tag gcr.io/viow-270002/viow-node-app .

docker build -t gcr.io/[PROJECT_ID]/[your-app-name]:latest .
gcloud auth configure-docker
docker push gcr.io/[PROJECT_ID]/[your-app-name]:latest
```

```bash
# run in wsl
sudo docker build -t gcr.io/mybot-live/vcx-app:latest --build-arg ARG_API_PORT=8080 .

# run in windows - slow in wsl
gcloud config set project mybot-live
gcloud auth configure-docker
docker push gcr.io/mybot-live/vcx-app:latest
gcloud run deploy vcx-app-service --image gcr.io/mybot-live/vcx-app:latest --platform managed --region asia-east1 --allow-unauthenticated

gcloud run deploy helloworld --image gcr.io/cloudrun/hello --platform managed --region asia-east1 --allow-unauthenticated --port=3000
gcloud container images delete gcr.io/cloudrun/helloworld
gcloud run services delete helloworld --platform managed --region asia-east1
```

## Minimal Permissions

- Storage
  - Storage Admin
  - Storage Object Admin

- Cloud Run
  - Service Account User
  - Cloud Run Admin

- **WIP** GKE
- **WIP** Scheduler
