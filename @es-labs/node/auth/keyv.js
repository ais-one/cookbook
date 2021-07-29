'use strict'

const keyv = require('../services/db/keyv') // set LRU and Expiry
exports.setRefreshToken = async (id, refresh_token) => await keyv.get().set(id, refresh_token)
exports.getRefreshToken = async (id) => await keyv.get().get(id)
exports.revokeRefreshToken = async(id) => await keyv.get().delete(id)
