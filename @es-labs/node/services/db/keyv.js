'use strict'

const Keyv = require('keyv')

module.exports = class StoreKeyV {
	constructor(options = global.CONFIG) {
    const { KEYV_CACHE } = options || {}
    this.KEYV_CACHE = KEYV_CACHE
    this.keyv = null
  }
  open () {
    this.keyv = this.KEYV_CACHE ? new Keyv(this.KEYV_CACHE) : new Keyv()
    this.keyv.on('error', err => console.error('keyv Connection Error', err))
  }
  get () { return this.keyv }
  close () { this.keyv = null }
}
