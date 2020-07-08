const fs = require('fs')
const path = require('path')

if (!global.APP_PATH) APP_PATH = ''
if (!global.LIB_PATH) LIB_PATH = ''
if (global.CONFIG.TEST_ENV) console.log('TEST_ENV =', global.CONFIG.TEST_ENV)

// set non-null config defaults here...

global.CONFIG.API_PORT = global.CONFIG.API_PORT || process.env.API_PORT || 3000
global.CONFIG.WS_PORT = global.CONFIG.WS_PORT || process.env.WS_PORT || 3001
global.CONFIG.WS_KEEEPALIVE_MS = global.CONFIG.WS_KEEEPALIVE_MS || 30000

// AUTH
global.CONFIG.SALT_ROUNDS = global.CONFIG.SALT_ROUNDS || 12
// HTTPONLY COOKIES
global.CONFIG.HTTPONLY_TOKEN = false // true, false (also set the same on FE..., true means place token in HttpOnly cookie) - DO TAKE NOTE OF CORS
// global.CONFIG.HTTPONLY_TOKEN = true // Use localStorage / sessionStorage
global.CONFIG.AUTH_USER_STORE = global.CONFIG.AUTH_USER_STORE || 'objection' // mongo, objection
global.CONFIG.AUTH_USER_STORE_NAME = global.CONFIG.AUTH_USER_STORE_NAME || 'users'
global.CONFIG.AUTH_USER_FIELD_ID_FOR_JWT = global.CONFIG.AUTH_USER_FIELD_ID_FOR_JWT || 'id' // mongo = _id, objection = id // can be NTID from SAML
global.CONFIG.AUTH_USER_FIELD_GROUPS_FOR_JWT = global.CONFIG.AUTH_USER_FIELD_GROUPS_FOR_JWT || 'groups' // can be AD Groups from SAML
global.CONFIG.AUTH_USER_FIELD_LOGIN = global.CONFIG.AUTH_USER_FIELD_LOGIN || 'email'
global.CONFIG.AUTH_USER_FIELD_PASSWORD = global.CONFIG.AUTH_USER_FIELD_PASSWORD || 'password' 
global.CONFIG.AUTH_USER_FIELD_GAKEY = global.CONFIG.AUTH_USER_FIELD_GAKEY || 'gaKey'

// AUTH JWT - secret key
global.CONFIG.JWT_ALG = global.CONFIG.JWT_ALG || 'HS256' // 'RS256' (use SSL certs), 'HS256' (use secret string)
global.CONFIG.JWT_SECRET = global.CONFIG.JWT_SECRET || '123456789' // HS256
global.CONFIG.JWT_EXPIRY = global.CONFIG.JWT_EXPIRY || 5, // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism, numeric is seconds
global.CONFIG.JWT_REFRESH_EXPIRY = global.CONFIG.JWT_REFRESH_EXPIRY || 3600 // do not allow refresh handling after X seconds
global.CONFIG.JWT_REFRESH_STORE = global.CONFIG.JWT_REFRESH_STORE || 'keyv' // mongo, objection, redis, keyv (default)
global.CONFIG.JWT_REFRESH_STORE_NAME = global.CONFIG.JWT_REFRESH_STORE_NAME || 'user_session' // collection or table name

// AUTH - OTP
global.CONFIG.USE_OTP = global.CONFIG.USE_OTP || 'TEST', // GA, SMS, '' (also on FE) set to TEST for testing using 111111 as PIN
global.CONFIG.OTP_EXPIRY = global.CONFIG.OTP_EXPIRY || '1m', // allow 1 minute for user to do OTP

// MONGO DB INFO - SHOULD STORE IN SEPERATE AES ENCRYPTED FILE IN PROD
// MONGO_URL=mongodb://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?authMechanism=SCRAM-SHA-1&authSource={AUTH_DBNAME}
// MONGO_URL=mongodb://127.0.0.1:27017/mm?replicaSet=rs0
global.CONFIG.MONGO_DB = global.CONFIG.MONGO_DB || 'testdb-' + process.env.NODE_ENV
global.CONFIG.MONGO_URL = global.CONFIG.MONGO_URL || 'mongodb://127.0.0.1:27017/testdb-' + process.env.NODE_ENV
// agendamq - requires mongodb
global.CONFIG.JOB_MONGO_URL = global.CONFIG.JOB_MONGO_URL || 'mongo' // if mongo, use MONGO_URL
global.CONFIG.JOB_COLLECTION = global.CONFIG.JOB_COLLECTION || 'agendaJobs' // collection name
global.CONFIG.JOB_TYPES = global.CONFIG.JOB_TYPES || '' // 'email', // 'email,sms,telegram' //  agenda message queue job types, comma seperated , find the path to agenda job

try {
  global.CONFIG.KNEXFILE = require('../knexfile')
  global.CONFIG.GCP_KEY= require('./secret/' + process.env.NODE_ENV + '.gcp.json') || ''
  // GOOGLE CLOUD/FIREBASE SERVICE ACCOUNT
  global.CONFIG.GCP_DEFAULT_BUCKET = global.CONFIG.GCP_DEFAULT_BUCKET || 'mybot-live.appspot.com'
} catch (e) {
  // console.log(e.toString())
}


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
  { folder: APP_PATH + '/public/demo-express', url: '/' },
  { folder: APP_PATH + '/public/demo-nobundler', url: '/demo-nobundler' },
  { folder: LIB_PATH + '/esm', url: '/js' }
]

global.CONFIG.UPLOAD_FOLDER = APP_PATH + '/uploads'
global.CONFIG.UPLOAD_URL = '/uploads' // for server uploads
global.CONFIG.UPLOAD_STATIC = [
  { folder: '', url: '' }
]

const JWT_CERT = process.env.JWT_CERT || path.join(__dirname, 'certs/jwt') // RS256
const HTTPS_CERT = process.env.HTTPS_CERT || ''

global.CONFIG.httpsCerts = HTTPS_CERT ? { key: fs.readFileSync(`${HTTPS_CERT}.key`), cert: fs.readFileSync(`${HTTPS_CERT}.crt`) } : null
global.CONFIG.jwtCerts = JWT_CERT ? { key: fs.readFileSync(`${JWT_CERT}.key`), cert: fs.readFileSync(`${JWT_CERT}.crt`) } : null

// Role-based access control - not needed, implemented by middleware - e.g. isAdmin after user authentication
