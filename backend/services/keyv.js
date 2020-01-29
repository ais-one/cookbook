const Keyv = require('keyv')
const  { KEYV_CACHE } = '../config'
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