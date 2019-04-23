import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

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
  uri: 'http://localhost:3000/graphql'
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

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    if (!localStorage.token) localStorage.setItem('token', '')
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
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
