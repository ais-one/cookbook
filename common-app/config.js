let config
if (!config) {
  const fs = require('fs')
  const path = require('path')
  const dotenv = require('dotenv')
  dotenv.config()
  if (process.env.NODE_ENV) {
    try {
      const envFile = path.join(APP_PATH, 'config', '.env.' + process.env.NODE_ENV)
      const envConfig = dotenv.parse(fs.readFileSync(envFile)) //  relative to index.js call
      for (var k in envConfig) process.env[k] = envConfig[k]
    } catch (e) {
      console.log('missing configuration file, using defaults', e.toString())
    }
  }
  config = require(APP_PATH + '/config')
}

module.exports = config
