const Queue = require('bull')
const queueMarketUpdates = new Queue('market-updates', 'redis://127.0.0.1:6379')

// consumer
async function processQueueMarketUpdates(job) { // returns a promise
  const { call, data } = job.data
  if (call === 'ticker') {
    try {
      const { now } = data
      console.log(now)
    } catch (e) {
    }
  }
  // Passes the value the promise is resolved with to the "completed" event
  return Promise.resolve()
}

queueMarketUpdates.process(processQueueMarketUpdates)


// producer

const Queue = require('bull')
const queueMarketUpdates = new Queue('market-updates', 'redis://127.0.0.1:6379')
const jobOpts = { removeOnComplete: true, removeOnFail: true }
try {
  queueMarketUpdates.add({ call: 'ticker', data: { now: new Date() } }, jobOpts)
} catch (e) {
  console.log('error', e.toString())
}

