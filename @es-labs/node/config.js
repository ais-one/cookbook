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
  process.env.APP_VERSION = version
  process.env.APP_NAME = process.env.APP_NAME || process.argv[3] || 'app-template'
  process.env.APP_PATH = path.join(app_path)
  // global.APP_PATH = path.join(app_path)
  
  if (NODE_ENV && process.env.APP_PATH) {
    // load defaults
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

    // Using App Role token on HCP
    // const { VAULT_URL, VAULT_ROLE_ID, VAULT_SECRET_ID } = global.CONFIG // HCP
    // if (VAULT_URL) {
    //   try {
    //     const vloginRes = await axios.post(VAULT_URL + '/auth/approle/login', {
    //       role_id: VAULT_ROLE_ID,
    //       secret_id: VAULT_SECRET_ID
    //     })
    //     const token = vloginRes.data.auth.client_token
    //     const vaultRes = await axios.get(VAULT_URL + '/kv/data/<whatever>', { headers: { 'X-Vault-Token': token } })
    //     const vaultConfig = vaultRes.data.data.data
    //     global.CONFIG = { ...CONFIG, ...vaultConfig }
    //   } catch (e) {
    //     console.log('HCP vault response error', e.toString(), VAULT_URL)
    //   }
    // }


    const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))
    await sleep(2000)
    console.log('CONFIG DONE!')
  } else {
    console.log('NODE_ENV and APP_PATH needs to be defined')
  }
}
