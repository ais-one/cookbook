//
// readlinePkg = require('readline')
module.exports = (exceptionFn, signalFn, readlinePkg) => {
  let defaultExceptionFn = async (e) => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      return process.exit(0)
    } catch (_) {
      return process.exit(1)
    }
  }
  if (!exceptionFn) exceptionFn = defaultExceptionFn
  
  let defaultSignalFn = async () => {
    console.log('Signal Trap', type)
    try {
    } catch (e) {
    } finally {
      // Do not call this as need time to close the server...
      // process.kill(process.pid, type)
    }
  }
  if (!signalFn) signalFn = defaultSignalFn
  
  const exceptions = ['unhandledRejection', 'uncaughtException']
  exceptions.forEach(type => {
    process.on(type, exceptionFn)
  })
  
  if (process.platform === "win32" && readlinePkg) { // handle for windows
    const rl = readlinePkg.createInterface({
      input: process.stdin,
      output: process.stdout
    })  
    rl.on("SIGINT", function () {
      process.emit("SIGINT");
    })
  }  

  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'] // SIGINT might not work on windows
  signals.forEach(type => {
    process.once(type, signalFn)
  })
}
