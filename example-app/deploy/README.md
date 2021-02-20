# Deployment Configs & Files

## Files

- knexfile.js
- <env>.gcp.json
- <env>.gcp.cors.json
- <env>.pem

### knexfile.js Example

```js
const path = require('path')

module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, '..', 'dev.sqlite3') }, // relative to directory that package.json was run
    migrations: { directory: '../db/migrations' },
    seeds: { directory: '../db/seeds/development' },
    useNullAsDefault: true  
  },
  uat: {

  }
}
```

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

Run the following command

```bash
gsutil cors set [JSON_FILE_NAME].json gs://[BUCKET_NAME]
gsutil cors get gs://[BUCKET_NAME]
```

### <env>.pem Example

For SSH to VM


# DB Migration & Seeds

## Knex

no longer in use...

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