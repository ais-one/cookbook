
const { ApolloServer } = require('apollo-server-express')
let apollo

if (!apollo) {
  const { typeDefs, resolvers } = require('../schema')
  apollo = new ApolloServer({ typeDefs, resolvers })
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
// src/models/user.js
export const generateUserModel = ({ req }) => ({
 getAll: () => {
   return fetch('http://myurl.com/users', { headers: req.headers });
 },
});
*/

module.exports = apollo