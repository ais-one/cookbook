const Queue = require('bull')
const queueMarketUpdates = new Queue('market-updates', 'redis://127.0.0.1:6379')
const jobOpts = { removeOnComplete: true, removeOnFail: true } 
const SHORT_DELAY_MS = 500

const delayMs = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchTickers = async () => {
  try {
    const data = { now: new Date() } // get / generate some data
    queueMarketUpdates.add({ call: 'ticker', data }, jobOpts)
  } catch (e) {
    console.log('error', e.toString())
  }
}

const run = async () => {  
  while (true) {
    await fetchTickers ()
    await delayMs(SHORT_DELAY_MS)
  }
  // process.exit(0)
}

run().catch(e => console.error(`[***] ${e.message}`, e))

// const errorTypes = ['unhandledRejection', 'uncaughtException']
// const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

// errorTypes.map(type => {
//   process.on(type, async e => {
//     try {
//       console.log(`process.on ${type}`)
//       console.error(e)
//       process.exit(0)
//     } catch (_) {
//       process.exit(1)
//     }
//   })
// })

// signalTraps.map(type => {
//   process.once(type, async () => {
//     try {
//       await consumer.disconnect()
//     } finally {
//       process.kill(process.pid, type)
//     }
//   })
// })

// function heartbeat() {
//   clearTimeout(this.pingTimeout)
//   // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
//   // equal to the interval at which your server sends out pings plus a
//   // conservative assumption of the latency.
//   this.pingTimeout = setTimeout(() => {
//     this.terminate();
//   }, 30000 + 1000);
// const client = new WebSocket('wss://echo.websocket.org/'); 
// client.on('open', heartbeat);
// client.on('ping', heartbeat);
// client.on('close', function clear() {
//   clearTimeout(this.pingTimeout);
// });
