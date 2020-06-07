let config
if (!config) {
  const APPNAME = require('./appname')
  const fs = require('fs')
  const path = require('path')
  const dotenv = require('dotenv')
  dotenv.config()
  if (process.env.NODE_ENV) {
    try {
      const envConfig = dotenv.parse(fs.readFileSync(path.join(__dirname, '..', APPNAME, 'config') + '/.env.' + process.env.NODE_ENV)) //  relative to index.js call
      for (var k in envConfig) process.env[k] = envConfig[k]
    } catch (e) {
      console.log('missing configuration file, using defaults', e.toString())
    }
  }
  config = require('../' + APPNAME + '/config')
  config.APPNAME = APPNAME
}

module.exports = config
