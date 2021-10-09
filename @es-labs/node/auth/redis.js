'use strict'

let redis
exports.setTokenService = (service) => redis = service
exports.setRefreshToken = async (id, refresh_token) => redis.set(id, refresh_token)
exports.getRefreshToken = async (id) => redis.get(id)
exports.revokeRefreshToken = async(id) => redis.del(id)
