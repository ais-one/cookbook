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

require('@es-labs/node/express/init')()

// setup graceful exit
const handleExitSignal = async (signal) => await cleanup(`Signal ${signal}`, 0) // NOSONAR
const handleExitException = async (err, origin) => await cleanup(`Uncaught Exception. error: ${err?.stack || err} origin: ${origin}`, 1) // NOSONAR
const handleExitRejection = async (reason, promise) => await cleanup(`Unhandled Rejection. reason: ${reason?.stack || reason }`, 1) // NOSONAR
process.on('SIGINT', handleExitSignal)
process.on('SIGTERM', handleExitSignal)
process.on('SIGQUIT', handleExitSignal)
process.on('uncaughtException', handleExitException)
process.on('unhandledRejection', handleExitRejection)

const { HTTPS_PRIVATE_KEY, HTTPS_CERTIFICATE } = process.env
const https_opts = {}
if (HTTPS_CERTIFICATE) {
  https_opts.key = HTTPS_PRIVATE_KEY
  https_opts.cert = HTTPS_CERTIFICATE
  // UNUSED AT THE MOMENT
  // passphrase = (fs.readFileSync('passphrase.txt')).toString()
  // pfx = fs.readFileSync('./8ab20f7b-51b9-4c09-a2e0-1918bb9fb37f.pfx')
  // ca = fs.readFileSync('ca.cert')
}
const server = HTTPS_CERTIFICATE ? https.createServer(https_opts, app) : http.createServer(app)

// USERLAND - Add APM tool

require('@es-labs/node/express/preRoute')(app, express)
const graphqlWsServer = require('@es-labs/node/express/graphql')(app, server)
const services = require('@es-labs/node/services')
const authService = require('@es-labs/node/auth')

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
        await graphqlWsServer?.close()
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
services.start()
try {
  authService.setup(services.get('keyv'), services.get('knex1')) // setup authorization  
} catch(e) {
  console.log(e)
}

// ROUTES
try {
  require(`./app-sample-template/routes`)(app) // your
  require('./router')(app) // common routes
  app.use('/api/**', (req, res) => res.status(404).json({error: 'Not Found'}))
} catch (e) {
  console.log('Route loading exception', e.toString())
}
// END ROUTES

// Add OpenAPI
// const { OPENAPI_OPTIONS } = process.env
// const openApiOptions = JSON.parse(OPENAPI_OPTIONS || null)
const openApiOptions = {
  info: {
    version: '0.0.1',
    title: 'Express Template',
    description: 'Please log in an get token (could be http-only) from http://127.0.0.1:3000/refresh-token.html, also logout there (for http-only tokens)',
    license: {
      name: 'MIT',
    },
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  baseDir: __dirname,
  filesPattern: ['./**/*.js'],
}
if (openApiOptions) {
  const expressJSDocSwagger = require('express-jsdoc-swagger')
  expressJSDocSwagger(app)(openApiOptions)
}

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname
  if (pathname === '/subscriptions') { // upgrade the graphql server
    graphqlWsServer.handleUpgrade(request, socket, head, (ws) => {
      graphqlWsServer.emit('connection', ws, request);
    })
  }
  console.log('upgrade event')
})

require('@es-labs/node/express/postRoute')(app, express)

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
