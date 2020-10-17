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

