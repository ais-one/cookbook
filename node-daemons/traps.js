module.exports = (signalFn, exceptionFn) => {
  let defaultExceptionFn = async (e, type) => {
    console.log(type, e.toString())
    // process.emit("SIGTERM") // process.exit(0), process.kill(process.pid, type)
  }
  if (!exceptionFn) exceptionFn = defaultExceptionFn
  const exceptions = ['unhandledRejection', 'uncaughtException']
  exceptions.forEach(type => process.on(type, (e) => exceptionFn(e, type)))
  
  let defaultSignalFn = async (type) => console.log(type)
  if (!signalFn) signalFn = defaultSignalFn
  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'] // SIGINT now works on windows
  // if (process.platform === 'win32') {
  //   require('readline').createInterface({ input: process.stdin, output: process.stdout }).on('SIGINT', () => process.emit('SIGINT'))
  // }
  signals.forEach(type => process.once(type, async () => {
    const exitCode = await signalFn(type)
    return Number.isInteger(exitCode) ? process.exit(parseInt(exitCode)) : process.exit(-10001) // should terminate the application
  }))
}
