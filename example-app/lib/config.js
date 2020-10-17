'use strict'
const axios = require('axios')
// let config
// if (!config) {
module.exports = async function() {
  const path = require('path')
  const { NODE_ENV, VAULT } = process.env

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
      // let bufferObj = Buffer.from(originalString, "utf8") // Create buffer object, specifying utf8 as encoding
      // let base64String = bufferObj.toString("base64") // Encode the Buffer as a base64 string
      let bufferObj = Buffer.from(VAULT, "base64") // Create a buffer from the string
      let decodedString = bufferObj.toString("utf8") // Encode the Buffer as a utf8 string
      try {
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
