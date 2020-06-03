module.exports = function ({ server, wss, agenda, knex, mongo }) {
  async function handleExit(signal) {
    console.log(`Received ${signal}. Close my server properly.`)
    if (agenda) await agenda.stop() // graceful exit for message queue - actually this should be a seperate process

    server.close(async () => {
      console.log('Server closed.')
      // close your other stuff...
      if (wss) wss.close((e) => console.log(e || 'WS API CLOSE OK')) // websockets
      if (agenda) await agenda.stop()
      if (knex) await knex.destroy()
      if (mongo) await mongo.close();
      // TBD does apollo graphql have a shutdown?
      process.exit(0)
    })
  }
  process.on('SIGINT', handleExit)
  process.on('SIGQUIT', handleExit)
  process.on('SIGTERM', handleExit)
}