# Deployment - WIP

The following are the environments

- development (used for local development)
- uat
- production (not shown in the example but can be created)

### development environment

The development environment is on a local machine used by developers.

Docker compose can be used to set up supporting applications such as Redis, ElasticSearch, Kafka, etc.

- cloudflare - no
- frontend - local
- backend - local
- mongodb - local
- file uploads - local folder / Google object storage
- sqlite - local file
- user_session - local memory

Commands for running locally are described in the QUICK START.


### uat (and also production) environment

The UAT, production and (optional staging) environments are on the service provider.

- Domain name verification
- cloudflare
  - DNS (for API, for frontend)
  - full SSL (can be self-signed at server side)
- frontend - GCP object storage, https
- backend - docker-> Google Cloud Run, https
  - OPTION deploy to GCP Group Instances (need to set load balancer and networking) **WIP**
  - OPTION deploy to GKE **WIP**
- Mongodb - Mongo Atlas
- files - Google object storage
- Mysql/Postgres - RDS
- user_session - same as Mongodb

SCALING & DEPLOYMENT STRATEGIES
- There should always be alternatives to the service you are using.
- E.g S3 bucket can be replaced by GCP Cloud Storage

## Current Manual Deployment Script

In GCP
- setup service account in IAM with appropriate permissions
- enable and setup a storage bucket to serve webpage
  - you may need to have a domain name
- enable Cloud Run and Container Registry

In Mongo Atlas
- create mongo atlas account

### Backend - js-node/expressjs

In js-node/expressjs folder

1. place service account json file into [../../js-node/expressjs/apps/app-template/deploy/uat.gcp.json](../../js-node/expressjs/apps/app-template/deploy/uat.gcp.json)
2. set the mongodb info in [../../js-node/expressjs/apps/app-template/config/secrets/uat.env.js](../../js-node/expressjs/apps/app-template/config/secrets/uat.env.js)
3. set the CORS to allow frontend origin from the frontend setup 

```bash
# on windows, need to use bash shell
deploy.sh uat app-template
```

Note the URL returned you can test it using <URL>/api/healthcheck, you may need to wait awhile for initial response or retry a few times

### Frontend - js-web/vue-vite

In js-web/vue-vite folder

1. place service account json file into [../../js-web/vue-vite/deploy/uat.gcp.json](../../js-web/vue-vite/deploy/uat.gcp.json)
2. setup the API URL in [../../js-web/vue-vite/.env.uat](../../js-web/vue-vite/.env.uat) file from the Google Cloud Run URL returned in a successful backend setup

```bash
# on windows, need to use bash shell
deploy.sh uat
```

---

## Local Development

This is for local development purpose and tries to replicate as much of the real-life environment is possible

- git
- webhooks testing
  - called by internal - http://xip.io/ - e.g. https://www.127.0.0.1.xip.io/api/health
  - called by external site - ngrok
- NodeJS
  - with self signed cert
- WSL Ubuntu
- Docker
  - MongoDB, SAML, Kafka, MySQL, Vault docker compose files can be found in [../../docker-devenv](../../docker-devenv)

## Backend Application Container Build

We can build backend on container so that we can orchestrate using K8s

See [deployment-container.md](deployment-container.md)

And [../../js-node/expressjs/Dockerfile](../../js-node/expressjs/Dockerfile)

## Deployment Preparation

View files, folders and readme.md below, and configure them

### Backend

- js-node/expressjs/apps/app-template/config/
- js-node/expressjs/apps/app-template/deploy/
- js-node/expressjs/ecosystem.config.js (for pm2 deployments)
- js-node/expressjs/Dockerfile (for docker deployments)
- js-node/expressjs/deploy.sh
- js-node/expressjs/deploy-vm.sh

### Frontend

- js-web/vue-vite/.env.*
- js-web/vue-vite/deploy/
- js-web/vue-vite/deploy.sh

---

## Deployment On Single VM

For FIXED scale deployments / demos

Deploy on single VM everything - GCP GCE, AWS EC2, Digital Ocean, Linode
- pm2 or systemd
- local upload folder
- mongodb
- redis
- nodejs

See [deployment-vm.md](deployment-vm.md)


## Cloud Provider Specific SDKs

You need to know about SDK from each cloud provider to use them effectively

Google Cloud Platform - See [../gcp/home.md](../gcp/home.md)


## Demo Deployment On Cloud

Alternative for demo

Requires
- *VM
- *Cloud Storage
- *Firewall 80 -> 3000
- *Docker
- *Domain Name (no https, set cors origin)

* has free tier or Non-GCP item


## Scalable Deployment On Cloud (GCP)

- Frontend & File/Object Storage
  - GCS / S3 / Azure Storage
- Google Compute Engine - Instance Groups
  - See [../gcp/vmgroups.md](../gcp/vmgroups.md) - WORK IN PROGRESS
  - Docker, Instance Templates & GCE Grouped Instances & Load Balancer
- Google Kubernetes Engine
  - See [../gcp/k8s.md](../gcp/k8s.md) - WORK IN PROGRESS
  - Docker, GKE (Google Kubernetes Engine) & load balancer
  - AKE (Azure Kubernetes Engine)
- Others
  - Lambda, Functions (Stateless) / CloudRun
  - Google App Engine 
    - https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
- Database
  - RDS / CloudSQL
  - MongoDB Atlas https://www.mongodb.com/cloud/atlas (GCP/AWS/Azure)
- Memory Key-Value Store
  - https://cloud.google.com/memorystore/docs/redis
  - Redis Labs - https://app.redislabs.com/
- MQ
  - Google Pubsub https://cloud.google.com/pubsub/docs
  - agenda (uses MongoDB)

---

4. CloudFlare

CloudFlare should be used for all deployments

We do not use https://cloud.google.com/load-balancing/docs/ssl-certificates

SSL Strategies 
- Flexible: SSL User --> SSL --> CF --> GCP
- Full: SSL User --> SSL --> CF --> SSL --> GCP

Redirect
- always redirect http to https

## CORS

CORS Origin settings will follow frontend name - e.g. https://app.mybot.live

## Pricings

Cloud Flare USD20/mth

GCP Mongo 1.7G RAM, 10+50GB USD0.15/hr -> 108/mth
GCP Mongo 1.7G RAM, 10+10GB USD0.10/hr -> 72/mth
GCP Storage -> 1 (50GB) + 5.40 (1M class A + 1M class B)
GCP LB 20.44 (5 rules) + 0.01 (1GB)
Egress $1 per GB x all regions

2 x
1,460 total hours per month
VM class: regular
Instance type: n2-standard-2 (2cpu / 8GB RAM / 10GB SSD)
Region: Singapore
Ephemeral public IP 1,460 hours: USD 5.84
Sustained Use Discount: 20% 
Effective Hourly Rate: 0.100
Estimated Component Cost: 145.77 per 1 month (72.77 per month for 1 machine)


Mongo DB 10GB - 72 per month, 108 for 50GB
2cpu / 8GB RAM / 10GB SSD - 72.77 per month
File storage - 10 per month
Egress 0.11/GB per month (standard)
Egress 0.12 - 0.19/GB per month (premium)
