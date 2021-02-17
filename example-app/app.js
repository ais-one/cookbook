'use strict'

const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

const { HTTPS_CERTS } = global.CONFIG
const server = HTTPS_CERTS ? https.createServer(HTTPS_CERTS, app) : http.createServer(app)

// const expressOasGenerator = require('express-oas-generator')
// expressOasGenerator.handleResponses(app, {})
require('./common-express/preRoute')(app)

// START SERVICES
const { sleep } = require('esm')(module)('@es-labs/esm/sleep')
const objection = require('@es-labs/node/services/db/objection').open()
const mongodb = require('@es-labs/node/services/db/mongodb').open()
const websocket = require('@es-labs/node/services/websocket').open(null, null) // or set to null
const agenda = require('@es-labs/node/services/mq/agenda').open()
const bull = require('@es-labs/node/services/mq/bull').open()
// const hazelcast = require('@es-labs/node/services/db/hazelcast').open()
const shutdown = async () => {
  try {
    websocket.close() // websockets
    await agenda.close()
    await bull.close()
    await mongodb.close()
    await objection.close()
    // await hazelcast.close()
    // TBD does apollo graphql have a shutdown?
    await sleep(10) // wait awhile more for things to settle
    console.log('Server close done')
  } catch (e) {
    console.log(e)
  }
} 

const handleExit = async (signal) => {
  console.log(`Received ${signal}. Close my server properly. (nodemon causes problems here)`)
  server.close(async () => {
    // close your other stuff...
    try {
      await shutdown()
      console.log('Server close done')
    } catch (e) {
      console.log(e)
    }
    process.exit(0)
  })  
}
['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach(signal => process.on(signal, handleExit))
// END SERVICES

// START ROUTES
try {
  require('./router')(app)
  require('./graphql')(app, server)  
} catch (e) {
  console.log(e.toString())
}
// END ROUTES

// https://github.com/mpashkovskiy/express-oas-generator/issues/24#issuecomment-764469904
// expressOasGenerator.handleRequests()

require('./common-express/postRoute')(app, express)

module.exports = { server }
