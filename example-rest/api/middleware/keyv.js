const Keyv = require('keyv')
let keyv

console.log('KEYV_CACHE', process.env.KEYV_CACHE)

if (!keyv) {
  if (process.env.KEYV_CACHE) {
    keyv = new Keyv(process.env.KEYV_CACHE)
  } else {
    console.log('use map')
    keyv = new Keyv({ store: new Map() })
  }
}

module.exports = keyv