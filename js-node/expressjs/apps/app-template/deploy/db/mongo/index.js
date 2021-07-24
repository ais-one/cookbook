console.log('Usage - npm run mongo update, npm run mongo seed')
console.log(process.argv.length, process.argv)

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
