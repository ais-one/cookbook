'use strict'

const redis = require('../services/redis') // set LRU and Expiry
exports.setRefreshToken = async (id, refresh_token) => await redis.get().set(id, refresh_token)
exports.getRefreshToken = async (id) => await redis.get().get(id)
exports.revokeRefreshToken = async(id) => await redis.get().del(id)
