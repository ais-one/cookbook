'use strict'

let ObjectID
let mongo
let JWT_REFRESH_STORE_NAME
let AUTH_USER_STORE_NAME
exports.setTokenService = (service) => {
  mongo = service
  ObjectID = mongo.ObjectID
}
exports.setUserService = (service) => {
  mongo = service
  ObjectID = mongo.ObjectID
}
exports.setRefreshTokenStoreName = (name) => JWT_REFRESH_STORE_NAME = name
exports.setAuthUserStoreName = (name) => AUTH_USER_STORE_NAME = name

// NOTES:
// 1. id field must be unique index (different from mongodb _id) - db.collection('user_session').createIndex({ id: 1 }, { unique: true })
// 2. Use TTL index - db.collection('user_session').createIndex( { setAt: 1 }, { expireAfterSeconds: 3600 } )
// 3. (Optional) Use capped collection - db.createCollection( JWT_REFRESH_STORE_NAME, { capped: true, size: 100000 } )
exports.setRefreshToken = async (id, refresh_token) => mongo.db.collection(JWT_REFRESH_STORE_NAME).updateOne({ _id: new ObjectID(id) }, { $set: { refresh_token, setAt: new Date() } }, { upsert: true, w: 1, j: true, wtimeout: 2000 })
exports.getRefreshToken = async (id) => ( await mongo.db.collection(JWT_REFRESH_STORE_NAME).findOne({ _id: new ObjectID(id) }) ).refresh_token
exports.revokeRefreshToken = async(id) => mongo.db.collection(JWT_REFRESH_STORE_NAME).deleteOne({ _id: new ObjectID(id) })

exports.findUser = async (where) => mongo.db.collection(AUTH_USER_STORE_NAME).findOne((where.id ? { _id: new ObjectID(where.id) } : where))
exports.updateUser = async (where, payload) => mongo.db.collection(AUTH_USER_STORE_NAME).updateOne(where.id ? { _id: new ObjectID(where.id) } : where, { $set: payload })
