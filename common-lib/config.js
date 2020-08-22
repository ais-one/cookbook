let config
if (!config) {
  const path = require('path')
  // const fs = require('fs')
  // const dotenv = require('dotenv')
  // dotenv.config()
  if (process.env.NODE_ENV && APP_PATH) {
    global.CONFIG = { NODE_ENV: process.env.NODE_ENV }
    try {
      const defaultCfg = require('./config.default.js')
      global.CONFIG = { ...CONFIG, ...defaultCfg }
    } catch (e) {
      console.log('missing default configuration file(s)', e.toString())
    }
    try {
      const commonEnv = require(path.join(APP_PATH, 'config', 'secret', 'common.env.js'))
      global.CONFIG = { ...CONFIG, ...commonEnv }
    } catch (e) {
      console.log('missing common configuration file(s)', e.toString())
    }
    try {
      const specificEnv = require(path.join(APP_PATH, 'config', 'secret', process.env.NODE_ENV + '.env.js'))
      global.CONFIG = { ...CONFIG, ...specificEnv }
      // const envFile = path.join(APP_PATH, 'config', 'secret', '.env.' + process.env.NODE_ENV)
      // const envConfig = dotenv.parse(fs.readFileSync(envFile)) //  relative to index.js call
      // for (var k in envConfig) process.env[k] = envConfig[k]
    } catch (e) {
      console.log('missing environment specific configuration file(s)', e.toString())
    }
    // read in the files here
    try {
      global.CONFIG.KNEXFILE = global.CONFIG.KNEXFILE ? require(APP_PATH + '/knexfile') : null
      global.CONFIG.GCP_KEY = global.CONFIG.GCP_KEY ? require(APP_PATH + '/config/secret/' + process.env.NODE_ENV + '.gcp.json') : ''

      global.CONFIG.httpsCerts = global.CONFIG.HTTPS_CERT ? { key: fs.readFileSync(`${global.CONFIG.HTTPS_CERT}.key`), cert: fs.readFileSync(`${global.CONFIG.HTTPS_CERT}.crt`) } : null
      global.CONFIG.jwtCerts = global.CONFIG.JWT_CERT ? { key: fs.readFileSync(`${global.CONFIG.JWT_CERT}.key`), cert: fs.readFileSync(`${global.CONFIG.JWT_CERT}.crt`) } : null  
    } catch (e) {
      console.log(e.toString())
    }    
  } else {
    console.log('NODE_ENV and APP_PATH needs to be defined')
  }
}
