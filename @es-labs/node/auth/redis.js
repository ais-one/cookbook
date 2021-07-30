'use strict'

let redis
exports.setTokenService = (service) => redis = service
exports.setRefreshToken = async (id, refresh_token) => await redis.set(id, refresh_token)
exports.getRefreshToken = async (id) => await redis.get(id)
exports.revokeRefreshToken = async(id) => await redis.del(id)
