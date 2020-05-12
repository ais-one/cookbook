const fs = require('fs')
const path = require('path')

console.log('TEST_ENV=',process.env.TEST_ENV)
const KNEXFILE = require('../knexfile')

const FIREBASE_KEY = require('./firebase.key.json') || ''

const JWT_CERT = process.env.JWT_CERT || path.join(__dirname, 'certs/jwt') // RS256
const HTTPS_CERT = process.env.HTTPS_CERT || ''

let jwtCerts
let httpsCerts

if (!jwtCerts && JWT_CERT) jwtCerts = { key: fs.readFileSync(`${JWT_CERT}.key`), cert: fs.readFileSync(`${JWT_CERT}.crt`) }
if (!httpsCerts && HTTPS_CERT) httpsCerts = { key: fs.readFileSync(`${HTTPS_CERT}.key`), cert: fs.readFileSync(`${HTTPS_CERT}.crt`) }

// config.js
// empty string, false or null means not available or used
module.exports = {
  NODE_ENV: process.env.NODE_ENV,

  // CERTS
  httpsCerts,
  jwtCerts,

  // PORTS
  API_PORT: process.env.API_PORT || 3000, // (also on FE)
  WS_PORT: process.env.WS_PORT || 3001, // (also on FE)

  WS_KEEEPALIVE_MS: process.env.WS_KEEEPALIVE_MS || 30000,

  SALT_ROUNDS: process.env.SALT_ROUNDS || 12,

  // JWT - secret key
  JWT_ALG: process.env.JWT_ALG || 'HS256', // 'RS256' (use SSL certs), 'HS256' (use secret string)
  JWT_SECRET: process.env.JWT_SECRET || '123456789', // HS256
  JWT_EXPIRY: process.env.JWT_EXPIRY || 5, // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism, numeric is seconds
  JWT_REFRESH_EXPIRY: 3600, // do not allow refresh handling after X seconds

  // OTP
  USE_OTP: process.env.USE_OTP || 'TEST', // GA, SMS, '' (also on FE) set to TEST for testing using 111111 as PIN
  OTP_EXPIRY: process.env.OTP_EXPIRY || '1m', // allow 1 minute for user to do OTP
  // OTP_SERVICE_NAME=Test Service // OTP / 2FA

  // CREATE FOR LOCALHOST: openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
  USE_HTTPS: process.env.USE_HTTPS || false, // USE_HTTPS should be path to letsencrypt location OR false 

  // ## CACHING CAN USE REDIS INSTEAD
  // KEYV_CACHE=redis://localhost:6379
  KEYV_CACHE: process.env.KEYV_CACHE || '',

  // MONGO DB INFO - SHOULD STORE IN SEPERATE AES ENCRYPTED FILE IN PROD
  // MONGO_URL=mongodb://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?authMechanism=SCRAM-SHA-1&authSource={AUTH_DBNAME}
  // MONGO_URL=mongodb://127.0.0.1:27017/mm?replicaSet=rs0
  MONGO_URL: process.env.MONGO_URL || '',

  // KNEX DB 
  KNEXFILE,

  // FIREBASE SERVICE ACCOUNT
  FIREBASE_KEY,
  FCM_SERVER_KEY: process.env.FCM_SERVER_KEY || '',

  // Github
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '', // verify a github token
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',

  // Communications - Telegram
  TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID || '',
  TELEGRAM_API_KEY: process.env.TELEGRAM_API_KEY || '',

  // Communications - Sendgrid
  SENDGRID_KEY: process.env.SENDGRID_KEY || '',

  // Communications - Nexmo
  NEXMO_FROM: process.env.NEXMO_FROM || 'VCXSMS', 
  NEXMO_KEY: process.env.NEXMO_KEY || '',
  NEXMO_SECRET: process.env.NEXMO_SECRET || '',

  // COMMON OPTIONS - APPLICABLE TO ALL ENVIRONMENTS

  // HTTPONLY COOKIES
  HTTPONLY_TOKEN: false, // true, false (also set the same on FE..., true means place token in HttpOnly cookie) - DO TAKE NOTE OF CORS
  // HTTPONLY_TOKEN: true // Use localStorage / sessionStorage

  // CORS - SAME ORIGIN - PROXIED
  //   CORS_OPTIONS: null
  //   PROXY_WWW_ORIGIN: 'example.com:8080'
  //   WWW_SERVE: ''

  // CORS - SAME ORIGIN - SERVED BY EXPRESS STATIC
  //   CORS_OPTIONS: null
  //   PROXY_WWW_ORIGIN: ''
  //   WWW_SERVE: 'public'

  // CORS - CROSS ORIGIN
  //   CORS_OPTIONS {
  //     ...
  //     withCredentials: true,
  //     origin: '127.0.0.1:8080'
  //   }
  //   PROXY_WWW_ORIGIN: ''
  //   WWW_SERVE: ''

  PROXY_WWW_ORIGIN: '', // 'http://127.0.0.1:8080', // used by proxy middleware
  // CORS_OPTIONS: null, // if withCredentials === false at Frontend
  CORS_OPTIONS: { // set withCredentials === true at Frontend
    // exposedHeaders: ['refresh-token'], // allow this to be sent back in response
    // maxAge
    // allowedHeaders
    // credentials
  
    // default cors settings
    // origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    // ALLOW CORS
    credentials: true, // Access-Control-Allow-Credentials value to true
    origin: 'http://127.0.0.1:8080' // '*'
  },
  // serve static content
  WWW_FOLDER: 'public', // serve website from folder, blank if do not serve from express. Must be '' if there is PROXY_WWW_ORIGIN
  // WWW_PATH: '' // NOT USED
  JS_FOLDER_1: 'common-web',
  JS_URL_1: '/js', // - <protocol>://<ip><:port>/js
  JS_FOLDER_2: 'common',
  JS_URL_2: '/js2', // - <protocol>://<ip><:port>/js2

  UPLOAD_URL: '/uploads',
  UPLOAD_FOLDER: 'uploads/',
  // File Uploads
  UPLOAD_PATH: 'uploads/', // for server uploads - // Should be relative to packsage json script folder

  SWAGGER_DEFS: { // Swagger / OpenAPI definitions
    info: {
      title: 'Vue Crud X',
      version: '1.0.0',
      description: 'A sample API',
    },
    host: '127.0.0.1:3000', // API host
    basePath: '/',
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Base', description: 'The Base API' },
    ],
    schemes: [ 'http', 'https' ],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    consumes: ['application/json'],
    produces: ['application/json']
  },

  JOB_TYPES: '', // 'email', // 'email,sms,telegram'
  JOB_DB: '127.0.0.1:27017/agenda-test', //  agenda message queue job types, comma seperated
  JOB_COLLECTION: 'agendaJobs',

  JOB_BULL: false,

  // Role-based access control - currently not used, for future implementation
  // get role from token
  // only handle GET, POST, PUT, PATCH, DELETE verbs
  accessControl: {
      '/api/authors/:id': {
      'GET': ['userRole', 'adminRole'], // or 'userRole,adminRole'
      'PUT,POST,DELETE': ['adminRole'] // or 'adminRole'
    },
    '/api/authors': {
      '*': ['*']
    },
    '*': { // all others allow only GET, if this entry is not here, then more restrictive, all other routes will result in 401 error (unauthorized access)
      'GET': ['*']
    }
  },

  ENABLE_LOGGER: false,
  USE_GRAPQL: true
}

