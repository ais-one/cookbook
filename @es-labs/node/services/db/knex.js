'use strict'

let knex

exports.open = async () => {
  const { KNEXFILE } = global.CONFIG
  if (!KNEXFILE) console.log('KNEXFILE property empty or undefined - knex not started')
  if (!knex && KNEXFILE) {
    try {
      const Knex = require('knex')
      knex = Knex(KNEXFILE)
      // sqlite, may need to use another statement with other sql dbs
      await knex.raw('select 1+1 as result').then(() => console.log('DB ok')).catch(err => { console.log('DB error: ' + err.toString()) })
    } catch (e) {
      console.log('db open err', e.toString())
    }
  }
  return this
}

exports.close = async () => {
  if (knex) await knex.destroy()
  console.log('db closed')
}

exports.get = () => knex

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
