'use strict'

const Keyv = require('keyv')

module.exports = class StoreKeyV {
	constructor() {
    const { KEYV_CACHE } = process.env
    this.KEYV_CACHE = JSON.parse(KEYV_CACHE || null) || { }
    this.keyv = null
  }
  open () {
    this.keyv = this.KEYV_CACHE ? new Keyv(this.KEYV_CACHE) : new Keyv()
    this.keyv.on('error', err => console.error('keyv Connection Error', err))
  }
  get () { return this.keyv }
  close () { this.keyv = null }
}
