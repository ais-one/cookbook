'use strict'; (async function() {
const path = require('path')
console.log('To be called by cron', __filename)
await require('../../@es-labs/node/config')(path.join(process.cwd(),'..','expressjs')) //  first thing to run
  console.log('Its better for cron call an API than to run this')
  console.log('unless this is long running job')
}())