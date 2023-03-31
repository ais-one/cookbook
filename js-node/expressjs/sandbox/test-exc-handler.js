// https://techsparx.com/nodejs/howto/error-handling.html

// setup graceful exit
// CLEANUP
const cleanup = async (message, exitCode = 0, coreDump = false, timeOutMs = 1000) => {
  console.log(message)
  console.log('exiting') // require('fs').writeSync(process.stderr.fd, `bbbbbbbbbbbb`)
  return coreDump ? process.abort : process.exit(exitCode)
  // setTimeout(() => console.log('exiting'), timeOutMs).unref()    
}


const handleExitSignal = async (signal) => await cleanup(`Signal ${signal}`, 0) // NOSONAR
const handleExitException = async (err, origin) => await cleanup(`Uncaught Exception. error: ${err?.stack || err} origin: ${origin}`, 1) // NOSONAR
const handleExitRejection = async (reason, promise) => await cleanup(`Unhandled Rejection. reason: ${reason?.stack || reason}`, 1) // NOSONAR
process.on('SIGINT', handleExitSignal)
process.on('SIGTERM', handleExitSignal)
process.on('SIGQUIT', handleExitSignal)
process.on('uncaughtException', handleExitException)
process.on('unhandledRejection', handleExitRejection) // overrides uncaughtException? why?

async function run() {
  console.log('start')
  // unhandledRejection
  // await new Promise((resolve, reject) => {
  //   reject(new Error())
  // })

  // signal
  // await new Promise(r => setTimeout(r, 20000));
  // console.log('end')

  // uncaughtException
  nonexistentFunc()
}

run()
