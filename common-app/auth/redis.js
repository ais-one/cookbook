const redis = require('../services/redis')

// set LRU and Expiry

const setToken = async (id, refresh_token) => await redis.set(id, refresh_token)

const getToken = async (id) => await redis.get(id)

const revokeToken = async(id) => await redis.del(id)

module.exports = { setToken, getToken, revokeToken }
