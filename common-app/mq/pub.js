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


// AGENDA EXAMPLE

/*
- server.js
- worker.js
lib/
  - agenda.js
  controllers/
    - user-controller.js
  jobs/
    - email.js
    - video-processing.js
    - image-processing.js
   models/
     - user-model.js
     - blog-post.model.js

// jobs/email.js

let email = require('some-email-lib'),
  User = require('../models/user-model.js')

module.exports = function(agenda) {
  agenda.define('registration email', async job => {
    const user = await User.get(job.attrs.data.userId)
    await email(user.email(), 'Thanks for registering', 'Thanks for registering ' + user.name())
  })

  agenda.define('reset password', async job => {
    // Etc
  })

  // More email related jobs
}


// lib/agenda.js

const Agenda = require('agenda')

const connectionOpts = {db: {address: 'localhost:27017/agenda-test', collection: 'agendaJobs'}}

const agenda = new Agenda(connectionOpts)

const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : []

jobTypes.forEach(type => {
  require('./jobs/' + type)(agenda)
});

if (jobTypes.length) {
  agenda.start(); // Returns a promise, which should be handled appropriately
}

module.exports = agenda


// lib/controllers/user-controller.js
let app = express(),
  User = require('../models/user-model'),
  agenda = require('../worker.js')

app.post('/users', (req, res, next) => {
  const user = new User(req.body)
  user.save(err => {
    if (err) {
      return next(err)
    }
    agenda.now('registration email', {userId: user.primary()})
    res.send(201, user.toJson())
  })
})

// worker.js
require('./lib/agenda.js')

*/

