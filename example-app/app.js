'use strict'

const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

const { HTTPS_CERTS } = global.CONFIG
// TLS 1.2
// const { constants } = require('crypto')
// const opts = {
//   secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
//   ciphers: 'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
//   honorCipher: true
// }
const server = HTTPS_CERTS ? https.createServer(HTTPS_CERTS, app) : http.createServer(app)

server.on('upgrade', function upgrade(request, socket, head) {
  // This function is not defined on purpose. Implement it with your own logic.
  // authenticate(request, (err, client) => {
  //   if (err || !client) {
  //     socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  //     socket.destroy();
  //     return;
  //   }
  //   wss.handleUpgrade(request, socket, head, function done(ws) {
  //     wss.emit('connection', ws, request, client)
  //   })
  // })
  console.log('upgrade event')
})

// const expressOasGenerator = require('express-oas-generator')
// expressOasGenerator.handleResponses(app, {})
require('@es-labs/node/express/preRoute')(app, express, global.CONFIG)

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

require('@es-labs/node/express/postRoute')(app, express, global.CONFIG)

module.exports = { server }
