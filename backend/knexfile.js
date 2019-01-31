// Update with your config settings.

// require('dotenv').config()
// const pg = require('pg')
// pg.defaults.ssl = true

// module.exports = {
//   client: 'pg',
//   connection: process.env.DATABASE_URL
// }

// console.log('KXENV', process.env.NODE_ENV)

// Mysql 8 issue for now
// ALTER USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY 'user123!@#PK';
// FLUSH PRIVILEGES;

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true
    // migrations: { stub: 'migration.stub' }
    // seeds: { directory: './seeds/dev' }
  },
  production: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      database: 'db',
      user:     'name',
      password: 'user123!@#PK'
    },
    pool: {
      min: 1,
      max: 5
    }
  }
};

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