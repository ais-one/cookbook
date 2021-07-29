'use strict'

const Keyv = require('keyv')
let keyv

exports.open = (options = global.CONFIG) => {
  const  { KEYV_CACHE } = options || {}
  if (!keyv) {
    keyv = KEYV_CACHE ? new Keyv(KEYV_CACHE) : new Keyv()
    keyv.on('error', err => console.error('keyv Connection Error', err))
  }
  return this
}
exports.get = () => keyv
exports.close = () => keyv = null
