(async function() {

console.log('Long running process sample', __filename)
console.log('this can be a Kafka producer... listen to incoming tcp messages and pushing to topic')
console.log('Do take note limitations for Long running NodeJS process')
console.log('Can also be for cronjobs (but better to use cronjob call an API)')

await require('@es-labs/node/config')(process.cwd()) //  first thing to run

// mixing ES Modules into a CommonJS project
// https://codewithhugo.com/use-es-modules-in-node-without-babel/webpack-using-esm/
const { sleep } = require('esm')(module)('@es-labs/esm/sleep')

const run = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.log('Test long running cron ' + Date.now())
    // eslint-disable-next-line no-await-in-loop
    await sleep(1000)
  }
  // process.exit(0)
}

run().catch(e => console.error(`[***] ${e.message}`, e))
const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type =>
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
)

signalTraps.forEach(type =>
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
)

}())
