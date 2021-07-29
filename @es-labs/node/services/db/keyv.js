'use strict'

const Keyv = require('keyv')
let keyv

exports.open = (options = global.CONFIG) => {
  const  { KEYV_CACHE } = options || {}
  if (!keyv) {
    // if (KEYV_CACHE) {
    //   keyv = new Keyv(KEYV_CACHE)
    // } else {
    //   keyv = new Keyv({ store: new Map() })
    // }
    keyv = new Keyv({ store: new Map() })
  }  
  return this
}
exports.get = () => keyv
exports.close = () => keyv = null