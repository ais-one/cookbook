const mongo = require('../services/db/mongodb')
const { JWT_REFRESH_STORE_NAME } = require('../config')

// id field must be unique index (different from mongodb _id)

const setToken = async (id, refresh_token) => await mongo.db.collection(JWT_REFRESH_STORE_NAME).updateOne({ id: id }, { $set: { refresh_token } }, { upsert: true, w: 1, j: true, wtimeout: 2000 })

const getToken = async (id) => {
  try {
    const rv = await mongo.db.collection(JWT_REFRESH_STORE_NAME).findOne({ id: id })
    return rv.refresh_token
  } catch (e) {
    return null
  }
}

const revokeToken = async(id) => await mongo.db.collection(JWT_REFRESH_STORE_NAME).deleteOne({ id: id})

module.exports = { setToken, getToken, revokeToken }
