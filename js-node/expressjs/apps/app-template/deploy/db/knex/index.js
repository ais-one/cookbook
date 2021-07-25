console.log('Usage - npm run knex -- development app-template <migrate or seed>')
// console.log(process.argv.length, process.argv)

if (process.argv.length >= 5) {
  if (process.argv[4] === 'migrate') {
    console.log('migrate')
    require('./migrations')
  } else if (process.argv[4] === 'seed') {
    console.log('seeding')
    require('./seeds')
  } else {
    console.log('unknown', process.argv)
  }
}
