import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

import { split } from 'apollo-link' // subscriptions
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  uri: 'ws://127.0.0.1:3000/subscriptions',
  options: {
    reconnect: true
  }
})

// HTTP connexion to the API
const httpLink = new HttpLink({
  // You should use an absolute URL here
  // credentials: 'include', // UNCOMMENT FOR HTTPONLY_TOKEN
  uri: 'http://127.0.0.1:3000/graphql'
})

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

// REMOVE authLink FOR HTTPONLY_TOKEN
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  let token = ''
  const item = localStorage.getItem('session') // survive a refresh
  if (item) {
    const user = JSON.parse(item)
    token = user.token
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '' // TBD - GraphQL not taking into account refresh token and revocation
    }
  }
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: authLink.concat(link), // REMOVE authLink FOR HTTPONLY_TOKEN
  cache,
  connectToDevTools: true,
  // fetchOptions: { credentials: 'include' }, // Does Not Work
  // request: operation => {
  //   if (!localStorage.token) localStorage.setItem('token', '')
  //   operation.setContext({ headers: { authorization: localStorage.getItem('token') } })
  // },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) console.log('networkError', networkError)
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.name === 'AuthenticationError') {
          // store.commit('setAuthError', err)
          // store.dispatch('signoutUser')
        }
        console.dir('graphQLErrors', err)
      }
    }
  }

})
