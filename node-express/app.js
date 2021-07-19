'use strict'

const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

const { HTTPS_CERTS, TLS_1_2 } = global.CONFIG
if (TLS_1_2) { // TLS 1.2
  // const { constants } = require('crypto')
  // const opts = {
  //   secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,
  //   ciphers: 'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
  //   honorCipher: true
  // }
}
const server = HTTPS_CERTS ? https.createServer(HTTPS_CERTS, app) : http.createServer(app)

const url = require("url")
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

let Sentry
const { SENTRY_DSN, SENTRY_SAMPLE_RATE, SENTRY_REQOPTS } = global.CONFIG
if (SENTRY_DSN) {
  Sentry = require('@sentry/node')
  const Tracing = require("@sentry/tracing")
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }), // enable HTTP calls tracing
      new Tracing.Integrations.Express({ app }), // enable Express.js middleware tracing
      // new Sentry.Integrations.OnUncaughtException({onFatalError: (e) => {
      //   Sentry.captureMessage('BIG Problem')
      //   // captureException
      //   // console.log('asdbsdghasdgkhsagdkhagsdjaghsdsjad', e)
      //   process.exit(1)
      // }}),
      // new Sentry.Integrations.OnUncaughtException({ onFatalError: () => { /** your implementation */ } }),
      // new Sentry.Integrations.OnUnhandledRejection({ onFatalError: () => { /** your implementation */ } }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring. We recommend adjusting this value in production
    tracesSampleRate: SENTRY_SAMPLE_RATE,
    environment: process.env.NODE_ENV,
  })
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler(SENTRY_REQOPTS))
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler())

  // app.use(Sentry.Handlers.errorHandler({ // by default Sentry handles 500 errors
  //   shouldHandleError(error) {
  //     return error.status >= 500 ? true : false
  //   }
  // }))
}

require('./common/preRoute')(app, express, global.CONFIG)

require('./common/passport').init(app)

// START SERVICES
const { sleep } = require('esm')(module)('@es-labs/esm/sleep')
const knex = require('@es-labs/node/services/db/knex')
const mongodb = require('@es-labs/node/services/db/mongodb')
const websocket = require('@es-labs/node/services/websocket').open(null, null) // or set to null
const agenda = require('@es-labs/node/services/mq/agenda').open()
const bull = require('@es-labs/node/services/mq/bull').open()
let graphqlWsServer

mongodb.open()
knex.open()
// const hazelcast = require('@es-labs/node/services/db/hazelcast').open()
const shutdown = async () => {
  try {
    websocket.close() // websockets
    await graphqlWsServer.close()
    await agenda.close()
    await bull.close()
    await mongodb.close()
    await knex.close()
    // await hazelcast.close()
    await sleep(10) // wait awhile more for things to settle
    console.log('shutdown done')
  } catch (e) {
    console.log(e)
  }
} 

// https://shapeshed.com/uncaught-exceptions-in-node/
// https://www.joyent.com/node-js/production/design/errors
// https://blog.heroku.com/best-practices-nodejs-errors
const handleExit = async (signal) => {
  console.log(`Received ${signal}. Close my server properly. (nodemon causes problems here)`)
  server.close(async () => { // close your other stuff...
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
} catch (e) {
  console.log(e.toString())
}
// END ROUTES

// GraphQL
const { GRAPHQL_SCHEMA_PATH, GRAPHQL_SUB_URL, GRAPHQL_URL } = global.CONFIG
if (GRAPHQL_SCHEMA_PATH) {
  const ws = require('ws')
  const { graphqlHTTP } = require('express-graphql')
  const { useServer } = require('graphql-ws/lib/use/ws')
  const { execute, subscribe } = require('graphql')
  const { schema, roots, rootValue } = require(GRAPHQL_SCHEMA_PATH) // to make cpnfigurable
  
  if (GRAPHQL_URL) {
    app.use(GRAPHQL_URL, graphqlHTTP({
      schema,
      rootValue,
      graphiql: {
        // subscriptionEndpoint: `ws://127.0.0.1:3000/subscriptions`, websocketClient: 'v1',
      },
    }))
  }
  
  if (GRAPHQL_SUB_URL) {
    graphqlWsServer = new ws.Server({ noServer: true, path: GRAPHQL_SUB_URL })
    useServer({
      schema,
      roots,
      execute,
      subscribe,
  
      onConnect: (ctx) => console.log('Connect', ctx),
      onSubscribe: (ctx, msg) => console.log('Subscribe', { ctx, msg }),
      onNext: (ctx, msg, args, result) => console.debug('Next', { ctx, msg, args, result }),
      onError: (ctx, msg, errors) => console.error('Error', { ctx, msg, errors }),
      onComplete: (ctx, msg) => console.log('Complete', { ctx, msg }),
    }, graphqlWsServer)  
  }
  // const graphQlserver = app.listen(3000, () => {
  //   const graphqlWsServer = new ws.Server({ server: graphQlserver, path: '/subscriptions', })
  //   useServer({ schema, roots, execute, subscribe, }, graphqlWsServer);
  // })  
}

require('./common/postRoute')(app, express, global.CONFIG)

if (SENTRY_DSN) app.use(Sentry.Handlers.errorHandler())

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
