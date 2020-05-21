# SCALING & DEPLOYMENT STRATEGIES

## Local Development Setup

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

## Cloud Dev Demo

Requires
- VM
- Firewall
- Docker

## Deployment Strategies

1. Small

Deploy on single VM everything

- pm2 or systemd
- local upload folder
- mongodb
- redis
- nodejs

- GCE, EC2

2. Medium

Frontend
- GCS / S3 / Azure Storage

File/Object Storage
- GCS / S3 / Azure Storage

Backend
- Docker, Instance Templates & GCE Grouped Instances & Load Balancer
- Google App Engine 
  - https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
- Lambda, Functions (Stateless) / CloudRun

Database
- RDS / CloudSQL
- Mongo Atlas

3. Large

Frontend
- GCS / S3 / Azure Storage

File/Object Storage
- GCS / S3 / Azure Storage

Backend
- Docker, GKE (Google Kubernetes Engine) & load balancer
- AKE (Azure Kubernetes Engine)
- Lambda, Functions (Stateless) / CloudRun

4. Other Backend Services

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

There should always be alternatives


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
Instance type: n2-standard-2
Region: Singapore
Ephemeral public IP 1,460 hours: USD 5.84
Sustained Use Discount: 20% 
Effective Hourly Rate: USD 0.100
Estimated Component Cost: USD 145.77 per 1 month