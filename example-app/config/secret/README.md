## Description

Contains secret config files
- common.env.js
- [env].env.js

The files are not committed To Github

## SAMPLE common.env.js

```
module.exports = {
  HTTPS_CERTS: { key: '', cert: '' },
  GCP_SERVICE_KEY: {},
}

```

## SAMPLE development.env.js

```
module.exports = {
  GCP_SERVICE_KEY: {},

  OAUTH_URL: '', // OAuth URL
  OAUTH_CLIENT_ID: '', // OAuth Client ID // used by example-native frontend
  OAUTH_CLIENT_SECRET: '', // OAuth Client SECRET
  OAUTH_CALLBACK: '', // OAuth callback URL
  OAUTH_USER_URL: '', // to get user
  OAUTH_USER_ID: '', // the user id key
  OAUTH_USER_GROUPS: '', // the user groups key
  OAUTH_FIND_ID: '', // key to find user in internal DB
  FCM_SERVER_KEY: '',
}

```

## SAMPLE uat.env.js

```
module.exports = {
  JWT_REFRESH_STORE: '',
  MONGO_URL: '',
  MONGO_DB: '',

  AUTH_USER_STORE: '',
  AUTH_USER_STORE_NAME: '',
  AUTH_USER_FIELD_ID_FOR_JWT: '',
  AUTH_USER_FIELDS_JWT_PAYLOAD: '',
  AUTH_USER_FIELD_LOGIN: '',
  AUTH_USER_FIELD_PASSWORD: '', 
  AUTH_USER_FIELD_GAKEY: ''
}

```
