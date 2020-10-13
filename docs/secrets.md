## Secrets Management

### Secret Managers

- Hashicorp Vault
  - self hosted, docker
  - k8s, helm, sidecar
  - vault + mongoatlas
- Google Secrets
- AWS Secrets
- www.cyberark.com
- DIY?


### Environment

NODE_ENV=

APP_NAME=needed?
BUCKET_NAME=needed?

Cloud Provider (varies)
GCP_PROJECT_ID=
GCP_PROJECT_KEY=


### Considerations

- CICD environment
- Auto Scaling in Container Orchestration
- Need encryption?


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

