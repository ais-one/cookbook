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

const url = require("url")
server.on('upgrade', (request, socket, head) => {
  const protocol = request.headers['sec-websocket-protocol']
  console.log(protocol)
  const pathname = url.parse(request.url).pathname
  console.log(pathname)
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
    wsServer.handleUpgrade(request, socket, head, (ws) => {
      wsServer.emit('connection', ws, request);
    })
  }
  console.log('upgrade event')
})

require('./common/preRoute')(app, express, global.CONFIG)
require('./common/passport').init(app)

// START SERVICES
const { sleep } = require('esm')(module)('@es-labs/esm/sleep')
require('@es-labs/node/services/db/knex').open()
require('@es-labs/node/services/db/mongodb').open()
const websocket = require('@es-labs/node/services/websocket').open(null, null) // or set to null
const agenda = require('@es-labs/node/services/mq/agenda').open()
const bull = require('@es-labs/node/services/mq/bull').open()
// const hazelcast = require('@es-labs/node/services/db/hazelcast').open()
const shutdown = async () => {
  try {
    websocket.close() // websockets
    await agenda.close()
    await bull.close()
    await require('@es-labs/node/services/db/mongodb').close()
    await require('@es-labs/node/services/db/knex').close()
    // await hazelcast.close()
    await sleep(10) // wait awhile more for things to settle
    console.log('shutdown done')
  } catch (e) {
    console.log(e)
  }
} 

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
// https://github.com/graphql/express-graphql
// https://github.com/enisdenjo/graphql-ws
// https://shammelburg.medium.com/subscriptions-with-graphql-dfa8279af050

// https://httptoolkit.tech/blog/simple-graphql-server-without-apollo
// https://blog.logrocket.com/why-i-finally-switched-to-urql-from-apollo-client/
// https://dev.to/remorses/you-don-t-need-apollo-to-use-graphql-in-react-1277
// https://the-guild.dev/blog/subscriptions-and-live-queries-real-time-with-graphql (quite good)

const { GRAPHQL_SCHEMA_PATH, GRAPHQL_SUB_URL, GRAPHQL_URL } = global.CONFIG
if (GRAPHQL_SCHEMA_PATH) {
  const ws = require('ws')
  const { graphqlHTTP } = require('express-graphql')
  const { useServer } = require('graphql-ws/lib/use/ws')
  const { execute, subscribe } = require('graphql')
  const { schema, roots, rootValue } = require(GRAPHQL_SCHEMA_PATH) // to make cpnfigurable
  
  // const subscriptionEndpoint = ;
  // create express and middleware
  if (GRAPHQL_URL) {
    app.use(GRAPHQL_URL, graphqlHTTP({
      schema,
      rootValue,
      graphiql: {
        // subscriptionEndpoint: `ws://127.0.0.1:3000/subscriptions`, websocketClient: 'v1',
      },
    }))
  }
  
  // wsServer.close()
  if (GRAPHQL_SUB_URL) {
    const wsServer = new ws.Server({ noServer: true, path: GRAPHQL_SUB_URL })
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
    }, wsServer)  
  }
  // const graphQlserver = app.listen(3000, () => {
  //   const wsServer = new ws.Server({ server: graphQlserver, path: '/subscriptions', })
  //   useServer({ schema, roots, execute, subscribe, }, wsServer);
  // })  
}

require('./common/postRoute')(app, express, global.CONFIG)

module.exports = { server }
