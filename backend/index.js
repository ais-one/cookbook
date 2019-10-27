const apollo = require('./services/graphql')
const server = require('./app')
const { API_PORT } = require('./config')

server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
  console.log(`🚀 GraphQL Server ready at http://localhost:${API_PORT}${apollo.graphqlPath}`)
  console.log(`🚀 GraphQL Subscriptions ready at ws://localhost:${API_PORT}${apollo.subscriptionsPath}`)
})
  