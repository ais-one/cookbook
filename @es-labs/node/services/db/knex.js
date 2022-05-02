'use strict'


const Knex = require('knex')

module.exports = class StoreKnex {
	constructor(options = JSON.parse(process.env.KNEXFILE || null) || {}) {
    this.KNEXFILE = options
    this.knex = null
  }

  async open() {
    if (!this.KNEXFILE) console.log('KNEXFILE property empty or undefined - knex not started')
    else {
      try {
        this.knex = Knex(this.KNEXFILE)
        // sqlite, may need to use another statement with other sql dbs
        await this.knex.raw('select 1+1 as result')
        .then(() => console.log('knex CONNECTED'))
        .catch(err => { console.log('DB error: ' + err.toString()) })
      } catch (e) {
        console.log('knex CONNECT ERROR', e.toString())
      }
    }
  }
  get () { return this.knex }
  async close () {
    if (this.knex) await this.knex.destroy()
    console.log('knex closed')
  }
}

// NOSONAR
// Model.knex().destroy(() => {}) // returns a promise
// Update with your config settings.
// Mysql 8 issue for now
// ALTER USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY 'user123!@#PK';
// FLUSH PRIVILEGES;
// npx knex migrate:make create_users --env development
// npx knex migrate:latest --env development
// npx knex seed:make seed_name --env development
// npx knex seed:run --env development
// migrations
//
// exports.up = function (knex, Promise) {
//   return Promise.all([
//     knex.schema.createTable('ideas', table => {
//       table.increments('id').primary()
//       table.string('idea')
//       table.string('creator')
//     })
//   ])
// }
// exports.down = function (knex, Promise) {
//   return Promise.all([
//     knex.schema.dropTable('ideas')
//   ])
// }
// seeds
// exports.seed = function (knex, Promise) {
//   return knex('ideas').del().then(() => {
//     return knex('ideas').insert([
//         {creator: 'Ali', idea: 'A To Do List app!'},
//         {creator: 'Ali', idea: 'A Blog!'},
//         {creator: 'Ali', idea: 'A calculator'}
//     ])
//   })
// }

// https://dev.to/aspittel/objection--knex--painless-postgresql-in-your-node-app--6n6
