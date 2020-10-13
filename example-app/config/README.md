
### Sample common.env.js

```js
// settings common to all 3 environments
// process.env.NODE_ENV
module.exports = {
  API_PORT: 3000,
  WS_PORT: 3001,

  // set as null to not use RSA secrets for JWT
  JWT_CERTS: null, // { key: '', cert: '' },

  // set as null to not serve https
  HTTPS_CERTS: {
    key: '', // TBD
    cert: '', // TBD
  },

  GCP_SERVICE_KEY: null, // {}
  KNEXFILE: null, // {}

  SWAGGER_DEFS: {
    // Swagger / OpenAPI definitions
    openapi: '3.0.3',
    info: {
      title: 'example-app',
      version: '0.0.0',
      description: 'A sample API',
    },
    host: '127.0.0.1:3000', // API host
    basePath: '/',
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Base', description: 'The Base API' },
    ],
    components: {
      schemes: [ 'http', 'https' ],
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    consumes: ['application/json'],
    produces: ['application/json']
  }
}
```

### Sample development.env.js

```js
module.exports = {
  JWT_EXPIRY: 1800, // 5 // 1800 // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism, numeric is seconds
  JWT_REFRESH_EXPIRY: 3600, // 10 // 3600 // do not allow refresh handling after defined seconds
  OTP_EXPIRY: 30, // 8 // 30 // defined seconds to allow user to submit OTP

  KNEXFILE: {
    client: 'sqlite3',
    connection: { filename: 'dev.sqlite3' }, // relative to directory that package.json was run
    useNullAsDefault: true  
  },

  GCP_SERVICE_KEY: { // TBD
    type: '',
    project_id: '',
    private_key_id: '',
    private_key: '',
    client_email: '',
    client_id: '',
    auth_uri: '',
    token_uri: '',
    auth_provider_x509_cert_url: '',
    client_x509_cert_url: ''  
  },

  GITHUB_CLIENT_ID: '',
  GITHUB_CLIENT_SECRET: '',
  FCM_SERVER_KEY: '',
  TEST_ENV: 'aaa',
  JWT_REFRESH_STORE: 'keyv',
  ENABLE_LOGGER: false,
  USE_GRAPHQL: true,
  TTT: {
    aaa: 222,
    ccc: 'cdcd',
    zzz: () => console.log('ffff') //  DO NOT USE FUNCTIONS!!!
  }
}
```

### Sample uat.env.js

```js
module.exports = {
  CORS_ORIGINS: '', // TBD origin
  JWT_REFRESH_STORE: 'mongo',
  MONGO_URL: 'mongodb+srv://', // TBD Atlas
  MONGO_DB: 'test',

  WS_PORT: 0,
  USE_GRAPHQL: 0,

  AUTH_USER_STORE: 'mongo',
  AUTH_USER_STORE_NAME: 'users',
  AUTH_USER_FIELD_ID_FOR_JWT: '_id',
  AUTH_USER_FIELDS_JWT_PAYLOAD: 'email,groups', // comma seperated, can be AD Groups from SAML, email, etc.
  AUTH_USER_FIELD_LOGIN: 'email',
  AUTH_USER_FIELD_PASSWORD: 'password', 
  AUTH_USER_FIELD_GAKEY: 'gaKey'
}

```