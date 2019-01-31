
let Model

if (!Model) {
  const Knex = require('knex')
  const connection = require('../knexfile')
  Model = require('objection').Model
  const env = process.env.NODE_ENV || 'development'
  console.log('env', env)
  const knexConnection = Knex(connection[env])
  Model.knex(knexConnection)  
}

module.exports = Model
/*
import knex from 'knex'
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'migrations'
  },
  debug: process.env.DATABASE_DEBUG === 'true'
})
export default db
*/