// master list of config keys - defaults will be undefined unless specified

// Express - OpenAPI - refer to common-lib/express/preroute.js
// SWAGGER_DEFS
// ENABLE_LOGGER
// USE_HTTPS
// USE_GRAPHQL

// Github
// GITHUB_CLIENT_ID
// GITHUB_CLIENT_SECRET

// MQ - bullmq - requires redis - common-lib/services/mq/bull.js - currently not used
// JOB_BULL

// Communications - Nexmo - common-lib/comms/nexmo.js
// NEXMO_FROM
// NEXMO_KEY
// NEXMO_SECRET

// Communications - Telegram - common-lib/comms/telegram.js
// TELEGRAM_CHANNEL_ID
// TELEGRAM_API_KEY

// Communications - Sendgrid - common-lib/comms/email.js
// SENDGRID_KEY
// SENDGRID_SENDER

// Communications - Firebase MEssaging - common-lib/comms/fcm.js
// FCM_SERVER_KEY

// Caching - refer to common-lib/services/redis.js
// REDIS_CONFIG

// Caching - refer to common-lib/services/keyv.js
// KEYV_CACHE

let config
if (!config) {
  const path = require('path')
  // const fs = require('fs')
  // const dotenv = require('dotenv')
  // dotenv.config()
  if (process.env.NODE_ENV && APP_PATH) {
    try {
      global.CONFIG = { NODE_ENV: process.env.NODE_ENV }

      const commonEnv = require(path.join(APP_PATH, 'config', 'secret', 'common.env.js'))
      global.CONFIG = { ...CONFIG, ...commonEnv }
      const specificEnv = require(path.join(APP_PATH, 'config', 'secret', process.env.NODE_ENV + '.env.js'))
      global.CONFIG = { ...CONFIG, ...specificEnv }

      // const envFile = path.join(APP_PATH, 'config', 'secret', '.env.' + process.env.NODE_ENV)
      // const envConfig = dotenv.parse(fs.readFileSync(envFile)) //  relative to index.js call
      // for (var k in envConfig) process.env[k] = envConfig[k]
      require(APP_PATH + '/config')
    } catch (e) {
      console.log('missing configuration file, using defaults', e.toString())
    }
  } else {
    console.log('NODE_ENV and APP_PATH needs to be defined')
  }
}
