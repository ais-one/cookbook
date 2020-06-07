'use strict'
const Model = require(LIB_PATH + '/services/db/objection').get()

class User extends Model {
  static get tableName () {
    return 'users'
  }
}

module.exports = User
