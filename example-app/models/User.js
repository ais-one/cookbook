'use strict'
const Model = require('../../common-app/database')

class User extends Model {
  static get tableName () {
    return 'users'
  }
}

module.exports = User
