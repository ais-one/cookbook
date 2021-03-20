module.exports = {
  JWT_EXPIRY: 5, // 5 // 1800 // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism, numeric is seconds
  JWT_REFRESH_EXPIRY: 10, // 10 // 3600 // do not allow refresh handling after defined seconds
  OTP_EXPIRY: 30, // 8 // 30 // defined seconds to allow user to submit OTP
  JWT_REFRESH_STORE: 'keyv',
  USE_GRAPHQL: true,
  CORS_ORIGINS: 'http://127.0.0.1:8080,http://127.0.0.1:5500,,http://127.0.0.1:3000',

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
