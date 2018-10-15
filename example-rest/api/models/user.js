const Knex = require('knex')
const connection = require('../knexfile')
const { Model } = require('objection')

const knexConnection = Knex(connection[process.env.NODE_ENV])

Model.knex(knexConnection)


class User extends Model {
  static get tableName () {
    return 'users'
  }
}

module.exports = User