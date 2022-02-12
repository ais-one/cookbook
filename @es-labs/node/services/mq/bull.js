'use strict'
// TBD
let queueMarketUpdates

exports.open = () => {
  const  { JOB_BULL } = process.env
  if (JOB_BULL) {
    const Queue = require('bull')
    if (!queueMarketUpdates) {
      queueMarketUpdates = new Queue('market-updates', 'redis://127.0.0.1:6379')  
      queueMarketUpdates.process(processQueueMarketUpdates)  
    }  
  }
  return this
}

exports.close = () => {
  console.log('bull closed')
}

exports.get = () => queueMarketUpdates

// consumer
async function processQueueMarketUpdates(job) { // returns a promise
  const { message } = job.data
  console.log('Message from Bull MQ pub', message)
  // Passes the value the promise is resolved with to the "completed" event
  return Promise.resolve()
}
