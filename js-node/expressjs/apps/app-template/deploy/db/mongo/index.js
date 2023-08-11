console.log('Usage - npm run mongo -- development app-template <seed or update>')
// console.log(process.argv.length, process.argv)

const path = require('path')
require('dotenv').config()
const { APP_NAME } = process.env
require('dotenv').config({ path: path.join('apps', APP_NAME, '.env'), override: true } ) // from from project root
require('@es-labs/node/config')(process.cwd()) //  first thing to include

if (process.argv.length >= 5) {
  if (process.argv[4] === 'update') {
    console.log('updating')
    require('./update')
  } else if (process.argv[4] === 'seed') {
    console.log('seeding')
    require('./seed')
  } else {
    console.log('unknown', process.argv)
  }
}
