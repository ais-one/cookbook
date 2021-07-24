console.log('Usage - npm run knex update, npm run knex seed')
console.log(process.argv.length, process.argv)

if (process.argv.length >= 3) {
  if (process.argv[2] === 'migrate') {
    console.log('migrate')
    require('./migrations')
  } else if (process.argv[2] === 'seed') {
    console.log('seeding')
    require('./seeds')
  } else {
    console.log('unknown', process.argv)
  }
}
