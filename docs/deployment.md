# SCALING & DEPLOYMENT

## Local (without docker)

WSL Ubuntu
- MongoDB
- Redis

## On VM

- pm2 or systemd
- local upload folder
- mongodb
- redis
- nodejs

## Google Cloud

0. Download and install Google Cloud SDK
1. create project
2. add users
3. create service keys

4. setup cloud object storage
  - Google Cloud Storage, AWS S3, Alibaba Object Store

5. setup MongoDB Atlas on Google Cloud
  - https://www.mongodb.com/cloud/atlas
  - also available on Azure and AWS

6. setup Memory key-value store
  - https://cloud.google.com/memorystore/docs/redis
  - Redis Labs

7. Express Application
  - Google Kubernetes Engine, Azure Kubernetes Engine
  - Google App Engine 
    - https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
  - Google Compute Engine, EC2
  - Lambda, Functions (Stateless)

8. RDS (if RDBMS is required)

9. MQ
  - Google Pubsub https://cloud.google.com/pubsub/docs
  - agenda (uses MongoDB)
  - bull/bullmq (uses Redis)

There should always be alternatives
