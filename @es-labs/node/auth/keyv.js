'use strict'

let keyv
exports.setTokenService = (service) => keyv = service
exports.setRefreshToken = async (id, refresh_token) => keyv.set(id, refresh_token)
exports.getRefreshToken = async (id) => keyv.get(id)
exports.revokeRefreshToken = async(id) => keyv.delete(id)
