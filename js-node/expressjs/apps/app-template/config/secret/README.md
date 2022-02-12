## Description

Contains secret config files
- common.env.js
- [env].env.js

The files are not committed To Github

## SAMPLE common.env.js

```
module.exports = {
}

```

## SAMPLE development.env.js

```
module.exports = {
  GCP_SERVICE_KEY: {},
  OAUTH_OPTIONS: {
    URL: '', // OAuth URL
    CLIENT_ID: '', // OAuth Client ID
    CLIENT_SECRET: '', // OAuth Client SECRET
    CALLBACK: '', // OAuth callback URL
    USER_URL: '', // to get user
    USER_ID: '', // the user id key
    USER_GROUPS: '', // the user groups key
    FIND_ID: '', // key to find user in internal DB
  },
  FCM_SERVER_KEY: '',
}

```

## SAMPLE uat.env.js

```
module.exports = {
  JWT_REFRESH_STORE: '',
  MONGO_URL: '',

  AUTH_USER_STORE: '',
  AUTH_USER_STORE_NAME: '',
  AUTH_USER_FIELD_ID_FOR_JWT: '',
  AUTH_USER_FIELDS_JWT_PAYLOAD: '',
  AUTH_USER_FIELD_LOGIN: '',
  AUTH_USER_FIELD_PASSWORD: '', 
  AUTH_USER_FIELD_GAKEY: ''
}

```
