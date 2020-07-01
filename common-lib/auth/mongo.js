const mongo = require('../services/db/mongodb')
const { JWT_REFRESH_STORE_NAME } = require('../config')

// NOTES:
// 1. id field must be unique index (different from mongodb _id) - db.collection('user_session').createIndex({ id: 1 }, { unique: true })
// 2. Use TTL index - db.collection('user_session').createIndex( { setAt: 1 }, { expireAfterSeconds: 3600 } )
// 3. (Optional) Use capped collection - db.createCollection( JWT_REFRESH_STORE_NAME, { capped: true, size: 100000 } )

const setToken = async (id, refresh_token) => await mongo.db.collection(JWT_REFRESH_STORE_NAME).updateOne({ id: id }, { $set: { refresh_token, setAt: new Date() } }, { upsert: true, w: 1, j: true, wtimeout: 2000 })

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
