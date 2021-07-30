'use strict'

let keyv
exports.setTokenService = (service) => keyv = service
exports.setRefreshToken = async (id, refresh_token) => await keyv.set(id, refresh_token)
exports.getRefreshToken = async (id) => await keyv.get(id)
exports.revokeRefreshToken = async(id) => await keyv.delete(id)
