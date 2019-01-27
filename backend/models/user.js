'use strict'
const Model = require('../services/database')

class User extends Model {
  static get tableName () {
    return 'users'
  }
}

module.exports = User