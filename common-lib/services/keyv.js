// const KeyvRedis = require('@keyv/redis') // npm i @keyv/redis
// const Redis = require('ioredis')

// const redis = new Redis('redis://user:pass@localhost:6379')
// const keyvRedis = new KeyvRedis(redis)
// const keyv = new Keyv({ store: keyvRedis })

const Keyv = require('keyv')
const  { KEYV_CACHE } = require('../config')
let keyv

if (!keyv) {
  if (KEYV_CACHE) {
    keyv = new Keyv(KEYV_CACHE)
  } else {
    // console.log('use map')
    keyv = new Keyv({ store: new Map() })
  }
}

module.exports = keyv