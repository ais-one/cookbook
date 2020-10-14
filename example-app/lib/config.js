'use strict'

let config
if (!config) {
  const path = require('path')
  const { NODE_ENV, VAULT_RES } = process.env

  if (NODE_ENV && APP_PATH) {
    global.CONFIG = { NODE_ENV: NODE_ENV }
    // load defaults
    try {
      const defaultCfg = require('./config.default.js')
      global.CONFIG = { ...CONFIG, ...defaultCfg }
    } catch (e) {
      console.log('missing default configuration file(s)', e.toString())
    }

    if (!VAULT_RES) {
      // load from config file
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
    } else {
      try {
        const vaultRes = JSON.parse(VAULT_RES)
        // console.log(vaultRes.data.data)
        global.CONFIG = { ...CONFIG, ...vaultRes.data.data }
      } catch (e) {
        console.log('environment vault response error', e.toString())
      }
    }
  } else {
    console.log('NODE_ENV and APP_PATH needs to be defined')
  }
}
