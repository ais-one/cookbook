const mongo = require('../mongo')
const knex = require('../database').knex()
const ObjectID = require('mongodb').ObjectID

const { AUTH_USER_STORE, AUTH_USER_STORE_NAME } = require('../config')

module.exports = async (where) => {
  if (AUTH_USER_STORE === 'mongo') {
    if (where.id) where = { _id: new ObjectID(where.id) }
    return await mongo.db.collection(AUTH_USER_STORE_NAME).findOne(where)
  } else if (AUTH_USER_STORE === 'database') {
    return await knex(AUTH_USER_STORE_NAME).where(where).first()
  }
  return null
}
