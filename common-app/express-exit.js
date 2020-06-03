module.exports = function ({server, wss, agenda}) {
  async function handleExit(signal) {
    console.log(`Received ${signal}. Close my server properly.`)
    if (agenda) await agenda.stop() // graceful exit for message queue - actually this should be a seperate process

    server.close(() => {
      console.log('Server closed.')
      // close your other stuff...
      if (wss) wss.close((e) => console.log(e || 'WS API CLOSE OK')) // websockets
      // TBD apollo - does apollo have a shutdown?
      // database / mongo
      // mongo.db.close(false, (err, res) => {
      //   console.log('MongoDb connection closed.')
      //   process.exit(0)
      // })
      process.exit(0)
    })
  }
  process.on('SIGINT', handleExit)
  process.on('SIGQUIT', handleExit)
  process.on('SIGTERM', handleExit)
}