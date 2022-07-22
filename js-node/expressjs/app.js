'use strict'

const url = require("url")
const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

// using CJS in ESM sibling-module.js is a CommonJS module
// import { createRequire } from 'module'
// const require = createRequire(import.meta.url)
// const siblingModule = require('./sibling-module')

const { sleep } = require('esm')(module)('@es-labs/esm/sleep')

require('./common/init')()

// setup graceful exit
const handleExitSignal = async (signal) => await cleanup(`Signal ${signal}`, 0) // NOSONAR
const handleExitException = async (err, origin) => await cleanup(`Uncaught Exception. error: ${err} origin: ${origin}`, 1) // NOSONAR
const handleExitRejection = async (reason, promise) => await cleanup(`Unhandled Rejection. reason: ${reason}`, 1) // NOSONAR
process.on('SIGINT', handleExitSignal)
process.on('SIGTERM', handleExitSignal)
process.on('SIGQUIT', handleExitSignal)
process.on('uncaughtException', handleExitException)
process.on('unhandledRejection', handleExitRejection)

const { HTTPS_PRIVATE_KEY, HTTPS_CERTIFICATE, TLS_1_2 } = process.env
const https_opts = {}
if (HTTPS_CERTIFICATE) {
  https_opts.key = HTTPS_PRIVATE_KEY
  https_opts.cert = HTTPS_CERTIFICATE

  if (TLS_1_2) { // TLS 1.2
    // No longer needed with newer versions of NodeJS
    // const { constants } = require('crypto')
    // https_opts.secureOptions = constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1
    // https_opts.ciphers = 'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384'
    // https_opts.honorCipher = true

    // UNUSED AT THE MOMENT
    // passphrase = (fs.readFileSync('passphrase.txt')).toString()
    // pfx = fs.readFileSync('./8ab20f7b-51b9-4c09-a2e0-1918bb9fb37f.pfx')
    // ca = fs.readFileSync('ca.cert')
  }
}
const server = HTTPS_CERTIFICATE ? https.createServer(https_opts, app) : http.createServer(app)

require('./common/preRoute')(app, express)
const graphqlWsServer = require('./common/graphql')(app, server)
const Sentry = require('./common/sentry')(app)

// CLEANUP
const cleanup = async (message, exitCode = 0, coreDump = false, timeOutMs = 1000) => {
  console.log(message)
  console.log(`
  nodemon win - can see messages
  nodemon bash - can see messages
  node win - cannot see messages
  node bash - can see messages
  `)
  if (server) {
    server.close(async () => {
      try {
        await graphqlWsServer.close()
        await services.stop()
        // or should process.exit be placed here?
      } catch (e) {
        console.error(e)
      }
    })
  }
  console.log('cleaning up and awaiting exit...')
  await sleep(timeOutMs) // from here on... does not get called on uncaught exception crash
  console.log('exiting') // require('fs').writeSync(process.stderr.fd, `bbbbbbbbbbbb`)
  return coreDump ? process.abort : process.exit(exitCode)
  // setTimeout(() => console.log('exiting'), timeOutMs).unref()    
}

// SERVICES
const services = require(`./apps/${process.env.APP_NAME}/services`)
services.start()

// ROUTES
try {
  require('./router')(app)
} catch (e) {
  console.log('Route loading exception', e.toString())
}
// END ROUTES

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname
  if (pathname === '/subscriptions') { // upgrade the graphql server
    graphqlWsServer.handleUpgrade(request, socket, head, (ws) => {
      graphqlWsServer.emit('connection', ws, request);
    })
  }
  console.log('upgrade event')
})

require('./common/postRoute')(app, express)

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
