'use strict'; (async function() {
const path = require('path')

console.log('Long running process sample', __filename)
console.log('this can be a Kafka producer... listen to incoming tcp messages and pushing to topic')
console.log('Do take note limitations for Long running NodeJS process')
console.log('Can also be for cronjobs (but better to use cronjob call an API)')

await require('../../@es-labs/node/config')(path.join(process.cwd(),'..','expressjs')) //  first thing to run
// const { sleep } = require('esm')(module)('@es-labs/esm/sleep')

const MAX_CYCLES = 0
let running = true
let counter = 0

const run = async () => {
  // eslint-disable-next-line no-constant-condition
  while (running) {
    console.log('Test long running cron ' + Date.now())
    // eslint-disable-next-line no-await-in-loop
    await new Promise(r => setTimeout(r, 1000))
    if (MAX_CYCLES) {
      if (counter >= MAX_CYCLES) running = false
    }
    counter++
  }
  // process.exit(0)
}

run().catch(e => console.error(`[***] ${e.message}`, e))
require('@es-labs/node/traps')(async (type) => console.log(`Signal ${type}`))
}())
