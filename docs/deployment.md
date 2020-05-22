# SCALING & DEPLOYMENT STRATEGIES

There should always be alternatives

## Local Development

This is for local development purpose and tries to replicate as much of the real-life environment is possible

- git
- webhooks testing
  - called by internal - http://xip.io/ - e.g. https://www.127.0.0.1.xip.io/api/health
  - ngrok - called by external site
- NodeJS
  - selfsigned
- MongoDB
- WSL Ubuntu
- Docker
- Redis

## Backend Application Container Build

We can build backend on container so that we can orchestrate using K8s

See [deployment-container.md](deployment-container.md)

And [../example-app/Dockerfile](../example-app/Dockerfile)


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

Google Cloud Platform - See [deployment-gcp.md](deployment-gcp.md)


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

### Frontend

**Frontend**

GCS / S3 / Azure Storage

**File/Object Storage**

GCS / S3 / Azure Storage


### Backend

**Google Compute Engine - Instance Groups**

See [deployment-vmgroups.md](deployment-gcp-vmgroups.md) - WORK IN PROGRESS

- Docker, Instance Templates & GCE Grouped Instances & Load Balancer

**Google Kubernetes Engine**

See [deployment-gke-k8s.md](deployment-gcp-k8s.md) - WORK IN PROGRESS

- Docker, GKE (Google Kubernetes Engine) & load balancer
- AKE (Azure Kubernetes Engine)

**Others**

- Lambda, Functions (Stateless) / CloudRun
- Google App Engine 
  - https://cloud.google.com/appengine/docs/standard/nodejs/quickstart


### Other Services

Database
- RDS / CloudSQL
- MongoDB Atlas https://www.mongodb.com/cloud/atlas (GCP/AWS/Azure)

Memory Key-Value Store
- https://cloud.google.com/memorystore/docs/redis
- Redis Labs - https://app.redislabs.com/

MQ
- Google Pubsub https://cloud.google.com/pubsub/docs
- agenda (uses MongoDB)
- bull/bullmq (uses Redis)

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