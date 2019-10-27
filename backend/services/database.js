const { NODE_ENV } = require('../config')
let Model

if (!Model) {
  const Knex = require('knex')
  const connection = require('../knexfile')
  Model = require('objection').Model
  const knexConnection = Knex(connection[NODE_ENV])
  Model.knex(knexConnection)  
}

module.exports = Model
/*
import knex from 'knex'
const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  migrations: {
    tableName: 'migrations'
  },
  debug: DATABASE_DEBUG === 'true'
})
export default db
*/
