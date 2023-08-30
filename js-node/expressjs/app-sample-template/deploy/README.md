# Deployment Configs & Files

## Files & Folders

+ <env>.gcp.json (need to create your own)
+ <env>.gcp.cors.json (need to create your own)
+ <env>.pem (need to create your own)
+ db (example running scripts used to populate knex-supported db and mongodb)
  + knex
  + mongo
  + icc.json
  + state.json


### <env>.gcp.json Example

Google Service Key - Recommended to set sufficient permissions for deployment only

```json
{
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": ""
}
```

### <env>.gcp.cors.json Example

CORS Origin To Allow - For Google Cloud Storage

```json
[
  {
    "origin": ["http://127.0.0.1:8080", "https://uat.mybot.live"],
    "responseHeader": ["*"],
    "method": ["GET", "HEAD", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

Run the following command using gsutil to set GCP bucket CORS settings

```bash
gsutil cors set [JSON_FILE_NAME].json gs://[BUCKET_NAME]
gsutil cors get gs://[BUCKET_NAME]
```

### <env>.pem Example

For SSH to VM


# DB Migration & Seeds

## Knex

No longer in use...

```json
{
"db:migrate:make": "knex migrate:make",
"db:migrate": "knex migrate:latest",
"db:migrate:rollback": "knex migrate:rollback",
"db:seed:make": "knex seed:make",
"db:seed": "knex seed:run",
"knex": "cross-env NODE_ENV=%npm_package_config_env% npx knex migrate:latest --knexfile=deploy/knexfile.js && cross-env NODE_ENV=%npm_package_config_env% npx knex seed:run --knexfile=deploy/knexfile.js"
}
```

## MongoDB

N.A.