'use strict'

const knex = require('../services/db/knex').get()
const { JWT_REFRESH_STORE_NAME } = global.CONFIG

// id field must be unique index 

const setToken = async (id, refresh_token) => {
  await knex(JWT_REFRESH_STORE_NAME).insert({ id, refresh_token })
  await knex(JWT_REFRESH_STORE_NAME).where({id: id}).update({ id, refresh_token })
}

const getToken = async (id) => {
  try {
    // TBD use DB - maybe better to use DB since it is already being read
    // const user = await User.query().where('id', '=', id) // TBD FIX THIS
    // if (user && !user[0].revoked && req.body) refreshToken = user[0].refreshToken
    const rv = await knex(JWT_REFRESH_STORE_NAME).where({ id: id }).first()
    return rv.refresh_token
  } catch (e) {
    return null
  }
}

const revokeToken = async(id) => await knex(JWT_REFRESH_STORE_NAME).where({ id: id }).delete()

module.exports = { setToken, getToken, revokeToken }
