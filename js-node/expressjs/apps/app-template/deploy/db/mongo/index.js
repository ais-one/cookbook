console.log('Usage - npm run mongo -- development app-template <seed or update>')
// console.log(process.argv.length, process.argv)

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
