// try to move knexfile into the example-app
const path = require('path')

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      // relative to directory that package.json was run
      filename: path.join(__dirname, 'dev.sqlite3')
      // filename: './dev.sqlite3' // TOREMOVE
    },
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'dev.sqlite3')
    },
    migrations: { directory: './migrations' },
    seeds: { directory: './seeds' },
    useNullAsDefault: true,

    // client: 'mysql',
    // connection: {
    //   host: 'localhost',
    //   database: 'db',
    //   user: 'name',
    //   password: 'user123!@#PK'
    // },
    // pool: {
    //   min: 1, max: 5
    // }
  }
}
