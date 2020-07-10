const keyv = require('../services/keyv')

// set LRU and Expiry

const setToken = async (id, refresh_token) => await keyv.set(id, refresh_token)

const getToken = async (id) => await keyv.get(id)

const revokeToken = async(id) => await keyv.delete(id)

module.exports = { setToken, getToken, revokeToken }
