'use strict'

const url = require("url")
const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

const { sleep } = require('esm')(module)('@es-labs/esm/sleep')

const Sentry = require('./common/init')(app, express, global.CONFIG)
require('./common/preRoute')(app, express, global.CONFIG)

const { HTTPS_CERTS, TLS_1_2 } = global.CONFIG
if (TLS_1_2) { // TLS 1.2
  const { constants } = require('crypto')
  const opts = {
    secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
    ciphers: 'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
    honorCipher: true
  }
}

const server = HTTPS_CERTS ? https.createServer(HTTPS_CERTS, app) : http.createServer(app)
let graphqlWsServer = require('./common/graphql')(app, server)

// START SERVICES
const services = require(`./apps/${APP_NAME}/services`)
services.start()


// https://shapeshed.com/uncaught-exceptions-in-node/
// https://www.joyent.com/node-js/production/design/errors
// https://blog.heroku.com/best-practices-nodejs-errors
const handleExit = async (signal) => {
  console.log(`Received ${signal}. Close my server properly. (nodemon causes problems here)`)
  server.close(async () => {
    try {
      console.log('Server closing')
      await graphqlWsServer.close()
      await services.stop()
      await sleep(1000) // wait awhile more (1000ms) for things to settle
      console.log('Server closed')
      process.exit(0)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  })  
}
;['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach(signal => process.on(signal, handleExit))
// ['unhandledRejection', 'uncaughtException'].forEach(type => process.on(type, (e) => exceptionFn(e, type)))
// END SERVICES

// START ROUTES
try {
  require('./router')(app)
} catch (e) {
  console.log(e.toString())
}
// END ROUTES

server.on('upgrade', (request, socket, head) => {
  // const protocol = request.headers['sec-websocket-protocol']
  const pathname = url.parse(request.url).pathname
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
  if (pathname === '/subscriptions') { // upgrade the graphql server
    graphqlWsServer.handleUpgrade(request, socket, head, (ws) => {
      graphqlWsServer.emit('connection', ws, request);
    })
  }
  console.log('upgrade event')
})

require('./common/postRoute')(app, express, global.CONFIG)

if (Sentry) app.use(Sentry.Handlers.errorHandler())

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
// 'Bad Request': 400, 'Unauthorized': 401, 'Forbidden': 403, 'Not Found': 404, 'Conflict': 409, 'Unprocessable Entity': 422, 'Internal Server Error': 500,
app.use((error, req, res, next) => { // error middleware - 200s should not reach here
  // console.log('typeof error', error instanceof Error)
  console.log('error middleware', error)
  let message= 'Unknown Error'
  if (error.message) {
    // console.log('Error Object', error.name, error.name, error.stack)
    message = process.env.NODE_ENV === 'development' ? error.stack : error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error?.toString) {
    message = error.toString()
  }
  return (!res.headersSent) ? res.status(500).json({ message }) : next()
})

module.exports = { server }
