'use strict'

let config
if (!config) {
  const path = require('path')
  if (process.env.NODE_ENV && APP_PATH) {
    global.CONFIG = { NODE_ENV: process.env.NODE_ENV }
    // load defaults
    try {
      const defaultCfg = require('./config.default.js')
      global.CONFIG = { ...CONFIG, ...defaultCfg }
    } catch (e) {
      console.log('missing default configuration file(s)', e.toString())
    }

    // load common
    try {
      const commonEnv = require(path.join(APP_PATH, 'config', 'common.env.js'))
      global.CONFIG = { ...CONFIG, ...commonEnv }
    } catch (e) {
      console.log('missing common configuration file(s)', e.toString())
    }
    // load specific
    try {
      const specificEnv = require(path.join(APP_PATH, 'config', process.env.NODE_ENV + '.env.js'))
      global.CONFIG = { ...CONFIG, ...specificEnv }
    } catch (e) {
      console.log('missing environment specific configuration file(s)', e.toString())
    }

    // TBD load from secret manager...
  } else {
    console.log('NODE_ENV and APP_PATH needs to be defined')
  }
}
