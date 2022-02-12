'use strict'
let graphqlWsServer

module.exports = function(app, server) {
  const { GRAPHQL_SCHEMA_PATH, GRAPHQL_SUB_URL, GRAPHQL_URL } = process.env
  if (GRAPHQL_SCHEMA_PATH) {
    const ws = require('ws')
    const { graphqlHTTP } = require('express-graphql')
    const { useServer } = require('graphql-ws/lib/use/ws')
    const { execute, subscribe } = require('graphql')
    const { schema, roots, rootValue } = require(GRAPHQL_SCHEMA_PATH) // to make cpnfigurable
    
    if (GRAPHQL_URL) {
      app.use(GRAPHQL_URL, graphqlHTTP({ schema, rootValue, graphiql: {
        // subscriptionEndpoint: `ws://127.0.0.1:3000/subscriptions`, websocketClient: 'v1',
      }}))
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
    // NOSONAR
    // const graphQlserver = app.listen(3000, () => {
    //   const graphqlWsServer = new ws.Server({ server: graphQlserver, path: '/subscriptions', })
    //   useServer({ schema, roots, execute, subscribe, }, graphqlWsServer);
    // })  
  }
  return graphqlWsServer
}