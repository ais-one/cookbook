'use strict'

if (!global.APP_PATH) global.APP_PATH = ''
if (!global.LIB_PATH) global.LIB_PATH = ''
if (global.CONFIG.TEST_ENV) console.log('TEST_ENV =', global.CONFIG.TEST_ENV)

global.CONFIG.API_PORT = process.env.API_PORT || 3000
global.CONFIG.WS_PORT = 3001
global.CONFIG.WS_KEEEPALIVE_MS = 30000
global.CONFIG.USE_GRAPHQL = true // false

// AUTH
global.CONFIG.SALT_ROUNDS = 12

// HTTPONLY COOKIES
// true = use HttpOnly cookie, false - do not use HttpOnly cookie (alternatively use localStorage / sessionStorage - be careful, has security implications)
global.CONFIG.COOKIE_HTTPONLY = true // (also set on FE... credentials if cross origin, true means ) - DO TAKE NOTE OF CORS
// must be true if COOKIE_SAMESITE=None 
global.CONFIG.COOKIE_SECURE = false
// Strict (CORS_OPTIONS == null)
// Lax, None (None must use Secure also) - CORS_OPTIONS !== null, 
global.CONFIG.COOKIE_SAMESITE = 'Lax'

global.CONFIG.AUTH_USER_STORE = 'objection' // mongo, objection
global.CONFIG.AUTH_USER_STORE_NAME = 'users'
global.CONFIG.AUTH_USER_FIELD_ID_FOR_JWT = 'id' // mongo = _id, objection = id // can be NTID from SAML
global.CONFIG.AUTH_USER_FIELDS_JWT_PAYLOAD = 'email,groups' // comma seperated, can be AD Groups from SAML, email, etc.
global.CONFIG.AUTH_USER_FIELD_LOGIN = 'email'
global.CONFIG.AUTH_USER_FIELD_PASSWORD = 'password' 
global.CONFIG.AUTH_USER_FIELD_GAKEY = 'gaKey'

// AUTH JWT - secret key
global.CONFIG.JWT_ALG = 'HS256' // 'RS256' (use SSL certs), 'HS256' (use secret string)
global.CONFIG.JWT_SECRET = '123456789' // HS256
global.CONFIG.JWT_EXPIRY = 5 // 5 // 1800 // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism, numeric is seconds
global.CONFIG.JWT_REFRESH_EXPIRY = 3600 // 10 // 3600 // do not allow refresh handling after defined seconds
global.CONFIG.JWT_REFRESH_STORE = 'keyv' // mongo, objection, redis, keyv (default)
global.CONFIG.JWT_REFRESH_STORE_NAME = 'user_session' // collection or table name

// AUTH - OTP
global.CONFIG.USE_OTP = 'TEST' // GA, SMS, '' (also on FE) set to TEST for testing using 111111 as PIN
global.CONFIG.OTP_EXPIRY = 30 // 8 // 30 // defined seconds to allow user to submit OTP

// MONGO DB INFO - SHOULD STORE IN SEPERATE AES ENCRYPTED FILE IN PROD
// MONGO_URL=mongodb://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?authMechanism=SCRAM-SHA-1&authSource={AUTH_DBNAME}
// MONGO_URL=mongodb://127.0.0.1:27017/mm?replicaSet=rs0
global.CONFIG.MONGO_DB = 'testdb-' + process.env.NODE_ENV
global.CONFIG.MONGO_URL = 'mongodb://127.0.0.1:27017/testdb-' + process.env.NODE_ENV
// https://mongodb.github.io/node-mongodb-native/3.6/reference/connecting/connection-settings/
global.CONFIG.MONGO_OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  connectTimeoutMS: 30000, // small value timedout on cloudrun
  serverSelectionTimeoutMS: 30000
}

// agendamq - requires mongodb
global.CONFIG.JOB_MONGO_URL = 'mongo' // if mongo, use MONGO_URL
global.CONFIG.JOB_COLLECTION = 'agendaJobs' // collection name
global.CONFIG.JOB_TYPES = '' // 'email', // 'email,nexmo,telegram' //  agenda message queue job types, comma seperated , find the path to agenda job

global.CONFIG.KNEXFILE = null // knexfile
global.CONFIG.GCP_SERVICE_KEY = null // GCP SERVICE KEY { }
global.CONFIG.GCP_DEFAULT_BUCKET = 'mybot-live.appspot.com'

// CORS - SAME ORIGIN - PROXIED
//   CORS_OPTIONS: null
//   PROXY_WWW_ORIGIN: 'example.com:8080'
//   WEB_STATIC: ''

// CORS - SAME ORIGIN - SERVED BY EXPRESS STATIC
//   CORS_OPTIONS: null
//   PROXY_WWW_ORIGIN: ''
//   WEB_STATIC: 'public'

// CORS - CROSS ORIGIN
//   CORS_OPTIONS {
//     ...
//     withCredentials: true,
//     origin: '127.0.0.1:8080'
//   }
//   PROXY_WWW_ORIGIN: ''
//   WEB_STATIC: ''

// CORS_OPTIONS: null, // if withCredentials === false at Frontend
global.CONFIG.CORS_OPTIONS = { // set withCredentials === true at Frontend
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
  origin: global.CONFIG.CORS_ORIGINS || 'http://127.0.0.1:8080' // convert to array...
}

global.CONFIG.PROXY_WWW_ORIGIN = '' // 'http://127.0.0.1:8080', // used by proxy middleware

// serve static content - folder is relative to calling package.json
global.CONFIG.WEB_STATIC = [  // serve website from folder, blank if do not serve from express. Must be '' if there is PROXY_WWW_ORIGIN
  // options does not seem to work
  // check - https://expressjs.com/en/4x/api.html#express.static
  { folder: APP_PATH + '/public/demo-nobundler', url: '/demo-nobundler', options: { extensions: ['html'], index: false } },
  { folder: APP_PATH + '/lib/esm', url: '/js' },
  { folder: APP_PATH + '/public/demo-express', url: '/' }
]

global.CONFIG.UPLOAD_STATIC = [
  { folder: APP_PATH + '/uploads', url: '/uploads' },
  { folder: '', url: '' }
]

global.CONFIG.JWT_CERTS = null // { key: '', cert: '' }
global.CONFIG.HTTPS_CERTS = null // { key: '', cert: '' }

// Role-based access control - not needed, implemented by middleware - e.g. isAdmin after user authentication

// master list of config keys - defaults will be undefined unless specified

// Express - OpenAPI - refer to <lib>/express/preRoute.js
global.CONFIG.SWAGGER_DEFS = null
global.CONFIG.ENABLE_LOGGER = false

// Github
// global.CONFIG.GITHUB_CLIENT_ID = ''
// global.CONFIG.GITHUB_CLIENT_SECRET = ''

// Google
// global.CONFIG.GOOGLE_CLIENT_ID = ''
// global.CONFIG.GOOGLE_CLIENT_SECRET = ''

// Microsoft
// global.CONFIG.MS_CLIENT_ID = ''
// global.CONFIG.MS_CLIENT_SECRET = ''

// MQ - bullmq - requires redis - <lib>/services/mq/bull.js - currently not used
global.CONFIG.JOB_BULL = null

// Communications - Nexmo - <lib>/comms/nexmo.js
global.CONFIG.NEXMO_FROM = ''
global.CONFIG.NEXMO_KEY = ''
global.CONFIG.NEXMO_SECRET = ''

// Communications - Telegram - <lib>/comms/telegram.js
global.CONFIG.TELEGRAM_CHANNEL_ID = ''
global.CONFIG.TELEGRAM_API_KEY = ''

// Communications - Sendgrid - <lib>/comms/email.js
global.CONFIG.SENDGRID_KEY = ''
global.CONFIG.SENDGRID_SENDER = ''

// Communications - Firebase Messaging - <lib>/comms/fcm.js
global.CONFIG.FCM_SERVER_KEY = ''

// Communications - Firebase Messaging - <lib>/services/webpush.js
global.CONFIG.WEBPUSH_VAPID_URL = process.env.WEBPUSH_VAPID_URL || 'http://127.0.0.1:3000'

// Caching - refer to <lib>/services/redis.js
global.CONFIG.REDIS_CONFIG = null

// Caching - refer to <lib>/services/keyv.js
global.CONFIG.KEYV_CACHE = null
