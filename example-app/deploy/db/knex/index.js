if (process.argv.length >= 4) {
  if (process.argv[3] === 'migrate') {
    console.log('migrate')
    require('./migrations')
  } else if (process.argv[3] === 'seed') {
    console.log('seeding')
    require('./seeds')
  } else {
    console.log('unknown', process.argv)
  }
}
