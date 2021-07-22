## Secrets Management

### Considerations

It is important to manage your secrets

Need to take into consideration, the following:

- CICD environment
- Auto Scaling in Container Orchestration, bad practice to keep replicating
- Need encryption at rest
- Purpose, e.g. seperation of GCP Keys for deployment, GCP keys for service usage
- Where to place them, side car, secret manager etc.

### Secret Managers

- Hashicorp Vault [we use the docker version of this for our testing js-node/expressjs on local machine]
  - self hosted, docker
  - k8s, helm, sidecar
  - vault + mongoatlas
- Google Secrets
- AWS Secrets
- www.cyberark.com
- DIY?


### Deployment Environment Variables

Environment to consider If $CI === true

If non CI just

```bash

# not used not for CI passed in as $1 in deploy.sh
NODE_ENV=

APP_NAME=for backend only docker image name

# GCP Storage Bucket Name for frontend deployment
BUCKET_NAME=

# Cloud Provider
GCP_PROJECT_ID=

# Service key (from deploy folder if local deploy, env cicd env otherwise)
GCP_PROJECT_KEY=

# Vault Info (use config files if no vault) if VAULT=unused, do not call vault
VAULT=
```

### Use Of Files Or Not

- Cloud Service Keys - Deployment
  - Local - file
  - cloud
    - manual
      - file
    - cicd
      - env
- Knexfile - Database Migration
  - local - file
  - cloud
    - manual
      - file
    - cicd
      - na

### Serving Configs

- RSA public and private keys for JWT
  - should be served from a authentication sidecar
  - should be served from secrets manager (JSON/JS)
  - served from config file (JSON/JS)
  - self-generated

- SSL certificates
  - should use cloudflare or similar service for HTTPS
  - should be served from secrets manager (JSON/JS)
  - served from config file (JSON/JS)
  - self-generated

- Cloud Service Keys, Knexfile, Other Configs
  - should be served from secrets manager (JSON/JS)
  - served from config file (JSON/JS)

Environments
- local UI - local backend - local services - get from file path
- local UI - local backend - cloud services - get from file path
- local UI - cloud backend - cloud services - get from secret manager

