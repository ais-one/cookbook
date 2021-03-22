module.exports = {
  JWT_REFRESH_STORE: 'keyv',
  USE_GRAPHQL: true,
  CORS_ORIGINS: 'http://127.0.0.1:8080,http://127.0.0.1:5500,http://127.0.0.1:3000,http://127.0.0.1:8081', // port 8081 is from SAML

  // in secret
  // KNEXFILE: null,
  // GCP_SERVICE_KEY: null,
  // GITHUB_CLIENT_ID: '',
  // GITHUB_CLIENT_SECRET: '',
  // FCM_SERVER_KEY: '',

  TEST_ENV: 'aaa',
  ENABLE_LOGGER: false,
  TTT: {
    aaa: 222,
    cccxx: 'cdcd',
    zzz: () => console.log('ffff') //  DO NOT USE FUNCTIONS!!!
  }
}
