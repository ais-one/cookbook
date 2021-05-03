'use strict'

// For federation, look at...
// https://github.com/apollographql/federation-demo
// does not support subscriptions yet...

let pubsub
let apollo

module.exports = function (app, server) {
  const { USE_GRAPHQL } = global.CONFIG
  if (!apollo && USE_GRAPHQL) {
    const { ApolloServer, PubSub } = require('apollo-server-express')

    const { typeDefs, resolvers } = require('./schema')
    pubsub = new PubSub()
    apollo = new ApolloServer({
      typeDefs,
      resolvers,
      subscriptions: {
        path: '/subscriptions'
        // onConnect: (connectionParams, webSocket) => {
        //   if (connectionParams.authToken) {
        //     return validateToken(connectionParams.authToken)
        //       .then(findUser(connectionParams.authToken))
        //       .then(user => ({ currentUser: user }))
        //   }
        //   throw new Error('Missing auth token!');
        // }
      },
      formatError: error => ({ name: error.name, message: error.message }), // .replace('Context creation failed:', '')
      context: async ({ req, connection }) => {
        if (connection) { // subscription
          connection.context.pubsub = pubsub
          return connection.context;
        } else {
          // TBD - GraphQL not taking into account refresh token and revocation
          return {
            // User, Post,
            pubsub, // subscription
            // currentUser: await getUser(token)
          }  
        }
      }
    })
    apollo.applyMiddleware({ app }) 
    apollo.installSubscriptionHandlers(server)
    console.log('GraphQL init')
  }
  return apollo
}

// module.exports = apollo
