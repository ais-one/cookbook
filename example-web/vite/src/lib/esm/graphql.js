// FRONTEND ONLY

import { ApolloClient, HttpLink, split } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'

let apolloClient

const get = () => apolloClient

const init = (options) => {
  if (apolloClient) return apolloClient
  if (!options || !options.gql_uri || !options.gws_uri) return
  try {
    const wsLink = new WebSocketLink({ // subscriptions-transport-ws package needs to be installed also
      uri: options.gws_uri,
      options: {
        reconnect: true
      }
    })    
    const httpLink = new HttpLink({ // HTTP connexion to the API
      // You should use an absolute URL here
      // credentials: 'include', // UNCOMMENT FOR HTTPONLY_TOKEN
      uri: options.gql_uri,
    })

    const link = split( // split based on operation type
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
    
    const cache = new InMemoryCache() // Cache implementation

    apolloClient= new ApolloClient({
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
  } catch (e) {
    console.log(e.toString())
  }
  return apolloClient
} // end init

const apollo = {
  get,
  init
}

export default apollo
