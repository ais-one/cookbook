'use strict'
const Model = require('@es-labs/node/services/db/objection').get()
class User extends Model {
  static get tableName () {
    return 'users'
  }
}

module.exports = User
