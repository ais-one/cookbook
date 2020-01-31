const { NODE_ENV } = require('../config')
let Model

if (!Model) {
  const Knex = require('knex')
  const connection = require('../knexfile')
  Model = require('objection').Model
  const knexConnection = Knex(connection[NODE_ENV])
  Model.knex(knexConnection)
}

// Model.knex().destroy(() => {}) // returns a promise

module.exports = Model
