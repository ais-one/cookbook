console.log('Usage - windows: npm run mongo update, npm run mongo seed')
console.log('Usage - unix: npm run mongo:unix update, npm run mongo:unix seed')

require(require('path').join(process.cwd(), 'setup')) // first thing to setup
require(LIB_PATH + '/config') //  first thing to include from LIB_PATH

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
