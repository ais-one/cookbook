// try to move knexfile into the example-app	
const path = require('path')	

const dbConfigs = {	
  development: {	
    client: 'sqlite3',	
    connection: {	
      filename: path.join(__dirname, 'dev.sqlite3') // relative to directory that package.json was run	
    },	
    migrations: { directory: './db/migrations' },	
    seeds: { directory: './db/seeds/development' },	
    useNullAsDefault: true	
  },	
  uat: {	
    client: 'sqlite3',	
    connection: {	
      filename: path.join(__dirname, 'uat.sqlite3') // relative to directory that package.json was run	
    },	
    migrations: { directory: './db/migrations' },	
    seeds: { directory: './db/seeds/uat' },	
    useNullAsDefault: true	
  },	
  // production: {	
  //   client: 'mysql',	
  //   connection: {	
  //     host: 'localhost',	
  //     database: 'db',	
  //     user: 'name',	
  //     password: 'user123!@#PK'	
  //   },	
  //   pool: {	
  //     min: 1, max: 5	
  //   }	
  // }  	
}	

module.exports = {	
  [process.env.NODE_ENV]: dbConfigs[process.env.NODE_ENV]	
}
