console.log('Usage - NODE_ENV=development node index.js <seed or update>')
// console.log(process.argv.length, process.argv)

const path = require('path')
require('dotenv').config({ path: './mongo-sample/.env' })

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('MONGO_OPTIONS', process.env.MONGO_OPTIONS)
console.log('process.argv[2]', process.argv[2])

require('@es-labs/node/config')(process.cwd()) //  first thing to include

if (process.argv.length >= 3) {
  if (process.argv[2] === 'update') {
    console.log('updating')
    require('./update')
  } else if (process.argv[2] === 'seed') {
    console.log('seeding')
    require('./seed')
  } else {
    console.log('unknown', process.argv)
  }
}
