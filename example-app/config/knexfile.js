// try to move knexfile into the example-app	
const path = require('path')

module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: path.join(__dirname, '..', 'dev.sqlite3') }, // relative to directory that package.json was run
    migrations: { directory: '../db/migrations' },
    seeds: { directory: '../db/seeds/development' },
    useNullAsDefault: true  
  },
  uat: {
    client: 'mysql', // 'pg', 'mssql', 'oracle' ?
    // connection: "mysql://root:root@localhost:3306/test"
    connection: {
      host: 'localhost',
      database: 'test',
      user: 'root',
      password: 'root'
    },
    pool: {
      min: 1, max: 5
    }  
  }
}
