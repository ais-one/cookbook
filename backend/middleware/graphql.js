
const { ApolloServer, PubSub } = require('apollo-server-express')

// const { PubSub } = require('apollo-server') // subscriptions

let pubsub
let apollo

if (!apollo) {
  const { typeDefs, resolvers } = require('../schema')
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
        const token = req.headers['authorization'] || ''
        return {
          // User,
          // Post,
          pubsub, // subscription
          // currentUser: await getUser(token)
        }  
      }
    }
  })
}


/*
// src/server.js
context: ({ req }) => {
 // pass the request information through to the model
 return {
   user,
   models: {
     User: generateUserModel({ req }),
     ...
   }
 };
},
// src/models/User.js
export const generateUserModel = ({ req }) => ({
 getAll: () => {
   return fetch('http://myurl.com/users', { headers: req.headers });
 },
});
*/

module.exports = apollo