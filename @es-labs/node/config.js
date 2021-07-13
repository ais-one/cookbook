'use strict'
const axios = require('axios')
const path = require('path')
module.exports = async function(app_path) {
  process.env.NODE_ENV = process.env.NODE_ENV || process.argv[2] || '' // development, uat, production...
  const { NODE_ENV, VAULT } = process.env
  if (!NODE_ENV) {
    console.log('Exiting No Environment Specified')
    process.exit(1)
  }

  const { version, name } = require(path.join(app_path, 'package.json'))
  global.APP_VERSION = version
  global.APP_NAME = process.env.APP_NAME || process.argv[3] || 'app-custom'
  global.APP_PATH = path.join(app_path)
  
  if (NODE_ENV && APP_PATH) {
    global.CONFIG = { NODE_ENV: NODE_ENV }
    // load defaults
    try {
      const defaultCfg = require('./config.default.js')
      global.CONFIG = { ...CONFIG, ...defaultCfg }
    } catch (e) {
      console.log('missing default configuration file(s)', e.toString())
    }

    // load common config from file
    try {
      const commonEnv = require(path.join(APP_PATH, 'config', 'common.env.js'))
      global.CONFIG = { ...CONFIG, ...commonEnv }
    } catch (e) {
      console.log('missing common configuration file(s)', e.toString())
    }
    // load specific config from file
    try {
      const specificEnv = require(path.join(APP_PATH, 'config', process.env.NODE_ENV + '.env.js'))
      global.CONFIG = { ...CONFIG, ...specificEnv }
    } catch (e) {
      console.log('missing environment specific configuration file(s)', e.toString())
    }
    // load secret common config from file
    try {
      const commonEnv = require(path.join(APP_PATH, 'config', 'secret', 'common.env.js'))
      global.CONFIG = { ...CONFIG, ...commonEnv }
    } catch (e) {
      console.log('missing common configuration file(s)', e.toString())
    }
    // load secret specific config from file
    try {
      const specificEnv = require(path.join(APP_PATH, 'config', 'secret', process.env.NODE_ENV + '.env.js'))
      global.CONFIG = { ...CONFIG, ...specificEnv }
    } catch (e) {
      console.log('missing environment specific configuration file(s)', e.toString())
    }

    if (VAULT && VAULT !== 'unused') {
      // let base64String = Buffer.from(originalString, 'utf8').toString('base64') // utf8 to base64
      try {
        let decodedString = Buffer.from(VAULT, 'base64').toString('utf8') // base64 to utf8
        const vault = JSON.parse(decodedString)
        let vaultConfig = {} 
        if (vault.secrets) {
          // insecure and not a good way to get secrets
          vaultConfig = vault.secrets 
        } else if (vault.url) {
          // Get from Hashicorp Vault, can replace with other secrets manager
          // curl -s -H "X-Vault-Token: $token" $url
          const vaultRes = await axios.get(vault.url, { headers: { 'X-Vault-Token': vault.token } })
          vaultConfig = vaultRes.data.data.data  
        } else {
          console.log('environment unknown VAULT', VAULT)
        }
        global.CONFIG = { ...CONFIG, ...vaultConfig }
      } catch (e) {
        console.log('environment vault response error', e.toString(), VAULT)
      }
    }
    const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))
    await sleep(2000)
    console.log('CONFIG DONE!')
  } else {
    console.log('NODE_ENV and APP_PATH needs to be defined')
  }
}
