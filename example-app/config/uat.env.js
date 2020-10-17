module.exports = {
  JWT_EXPIRY: 7200,
  JWT_REFRESH_EXPIRY: 14400,
  OTP_EXPIRY: 60,
  COOKIE_HTTPONLY: 'Lax',
  CORS_ORIGINS: 'https://uat.mybot.live,http://uat.mybot.live',

  // in secret
  // JWT_REFRESH_STORE: '',
  // MONGO_URL: '',
  // MONGO_DB: '',
  // AUTH_USER_STORE: '',
  // AUTH_USER_STORE_NAME: '',
  // AUTH_USER_FIELD_ID_FOR_JWT: '',
  // AUTH_USER_FIELDS_JWT_PAYLOAD: '',
  // AUTH_USER_FIELD_LOGIN: '',
  // AUTH_USER_FIELD_PASSWORD: '', 
  // AUTH_USER_FIELD_GAKEY: '',

  WS_PORT: 0,
  USE_GRAPHQL: 0,
  WEB_STATIC: null,
  CORS_OPTIONS: {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    origin: ''
  }
}
