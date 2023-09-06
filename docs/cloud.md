# Cloud

Where GCP, AWS, Azure Aliyun, Most concepts are the same

Try to use terraform (TODO refer to DSO project)

## Install CLI

- GCP
  - https://cloud.google.com/sdk/
  - gcloud
  - gsutil (for Storage)
- AWS
  - AWS-cli
- Others
  - kubectl (for kubernetes)
  - openshift
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

### components
gcloud components list
gcloud components install [COMPONENT_ID] (e.g. kubectl)
gcloud components update
gcloud components remove [COMPONENT_ID]
```

## IAM and Role Policy and Service Keys

gcloud auth activate-service-account <service_key.client_email> --key-file=service_key.json

Associate appropriate policy and/or role to IAM user

## Minimal Permissions And Components Used

- Object Storage
  - Storage Admin
  - Storage Object Admin
- Cloud Run
  - Service Account User
  - Cloud Run Admin
- Cloud Function
- ECI instance (aliyun)
- Container Registy
- Load Balancer
- Resource Group
- VPC + VSwitch, Elastic IP, Security Group
- Logger

## Hosting Static Website on GCP

https://cloud.google.com/storage/docs/hosting-static-website

NAME TYPE DATA
www.example.com CNAME c.storage.googleapis.com

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

# Cloud Run

## Pre-Requisites

See [basic.md](basic.md) -> Docker Build And Push To gcr.io

## Cloud Run Contract

https://cloud.google.com/run/docs/reference/container-contract

## Some Commands

see deploy.sh **deploy-cr** on manually deploying to cloud run

```
gcloud services enable run.googleapis.com
gcloud run deploy [service name] --image gcr.io/$GOOGLE_CLOUD_PROJECT/helloworld --platform managed --region asia-southeast1 --allow-unauthenticated
gcloud container images delete gcr.io/$GOOGLE_CLOUD_PROJECT/helloworld
gcloud run services delete [service name] --platform managed --region asia-southeast1
gcloud container images list
```

Optional, setup custom domain (requires your own domain name)

**Notes:**

- Need to check if service deployed properly
- Clean up
  - service revisions
  - container images

## Example

```bash
gcloud run deploy helloworld --image gcr.io/cloudrun/hello --platform managed --region asia-east1 --allow-unauthenticated --port=3000
# gcloud container images delete gcr.io/cloudrun/helloworld
gcloud run services delete helloworld --platform managed --region asia-east1
```

## Environment Variables And Security Note

https://cloud.google.com/run/docs/configuring/environment-variables#command-line

## Cloudflare

1. Use Full SSL

https://serverfault.com/questions/995010/putting-google-cloud-platform-cloud-run-behind-cloud-flare

2. Set SSL Edge Certificate Flag (Not Really Needed)

https://cloud.google.com/run/docs/mapping-custom-domains#dns_update

3. Firewall -> Tools -> Rate Limiting

Set filter for login API

https://community.cloudflare.com/t/same-type-of-harmful-requests-slow-the-server/188520/4

# Firebase Getting Started

Go to https://firebase.google.com/

Click on get started and register. **Important** Add you credit details and enable billing

## Create User

1. Goto firebase Authentication
2. Enable Email/Password Sign-in Method
3. Create a user in Firebase Auth with Email/Password login

https://firebase.google.com/docs/auth/web/password-auth

## Firebase Web Client Credentials (subject to change)

Get your firebase web-client credentials from Project -> Settings -> General

Your app, select icon for web application

Client credentials should like like something below:

```
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "..."
  };
  firebase.initializeApp(config);
</script>
```

## Firebase Backend Credentials (subject to change)

Get your firebase backend credentials from Project -> Settings -> Service Accounts

## Messaging

Use Firebase Messaging for Push Notifications

## Hosting To Firebase

https://firebase.google.com/docs/hosting/quickstart

## Cloud Storage

Upload & Download Files

1. If public read access enable permissions
2. Upload use signed URL
3. Private download/read access use signed URL
