console.log('Usage - windows: npm run mongo update, npm run mongo seed')
console.log('Usage - unix: npm run mongo:unix update, npm run mongo:unix seed')

if (process.argv.length >= 4) {
  if (process.argv[3] === 'update') {
    console.log('updating')
    require('./update')
  } else if (process.argv[3] === 'seed') {
    console.log('seeding')
    require('./seed')
  } else {
    console.log('unknown', process.argv)
  }
}
