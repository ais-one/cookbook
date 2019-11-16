/*
# localhost development
# OTP / 2FA
OTP_SERVICE_NAME=Test Service
*/

const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
if (process.env.NODE_ENV) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.' + process.env.NODE_ENV))
    for (var k in envConfig) process.env[k] = envConfig[k]  
  } catch (e) {
    // console.log('missing configuration file, using defaults')
  }
}
console.log('Environment: ', process.env.NODE_ENV)

// config.js
// empty string, false or null means not available or used
module.exports = {
  NODE_ENV: process.env.NODE_ENV,

  // PORTS
  API_PORT: process.env.API_PORT || 3000,
  WS_PORT: process.env.WS_PORT || 3001,

  SALT_ROUNDS: process.env.SALT_ROUNDS || 12,

  // JWT - secret key
  JWT_ALG: process.env.JWT_ALG || 'HS256', // 'RS256' (use SSL certs), 'HS256' (use secret string)
  JWT_CERTS_PATH: process.env.JWT_CERTS_PATH || './certs/jwt', // RS256
  JWT_SECRET: process.env.JWT_SECRET || '123456789', // HS256
  JWT_EXPIRY: process.env.JWT_EXPIRY || '5s', // '150d', '15d', '15m', '15s', use small expiry to test refresh mechanism
  JWT_REFRESH_EXPIRY: 3600, // do not allow refresh handling after X seconds

  // OTP
  USE_OTP: process.env.USE_OTP || '', // GA, SMS, ''
  OTP_EXPIRY: process.env.OTP_EXPIRY || '1m', // allow 1 minute for user to do OTP

  // HTTPONLY
  // HTTPONLY_TOKEN: true,
  // WWW_PROXY_URL: 'http://127.0.0.1:8080',
  HTTPONLY_TOKEN: false,
  WWW_PROXY_URL: '',

  // CREATE FOR LOCALHOST: openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
  // HTTPS_CERTS_PATH: './certs/localhost',
  USE_HTTPS: process.env.USE_HTTPS || false, // USE_HTTPS should be path to letsencrypt location OR false 
  HTTPS_CERTS_PATH: process.env.HTTPS_CERTS_PATH || '',

  // ## CACHING CAN USE REDIS INSTEAD
  // KEYV_CACHE=redis://localhost:6379
  KEYV_CACHE: process.env.KEYV_CACHE || '',

  // MONGO DB INFO - SHOULD STORE IN SEPERATE AES ENCRYPTED FILE IN PROD
  // MONGO_URL=mongodb://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?authMechanism=SCRAM-SHA-1&authSource={AUTH_DBNAME}
  // MONGO_URL=mongodb://127.0.0.1:27017/mm?replicaSet=rs0
  MONGO_URL: process.env.MONGO_URL || '',

  // Github
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '', // verify a github token
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',

  // Telegram
  TELEGRAM_BOT_ID: process.env.TELEGRAM_BOT_ID || '',
  TELEGRAM_API_KEY: process.env.TELEGRAM_API_KEY || ''
}
