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
  try {
    const { gqlUri, gwsUri } = options
    if (!gqlUri) return //  must have at least httpLink

    // subscriptions-transport-ws package needs to be installed also
    const wsLink = gwsUri
      ? new WebSocketLink({
          uri: gwsUri,
          options: {
            reconnect: true
          }
        })
      : null

    // HTTP connetion to the API
    const httpLink = new HttpLink({
      // You should use an absolute URL here
      // credentials: 'include', // UNCOMMENT FOR HTTPONLY_TOKEN
      uri: gqlUri
    })

    // split based on operation type
    const link =
      wsLink && httpLink
        ? split(
            ({ query }) => {
              const { kind, operation } = getMainDefinition(query)
              return kind === 'OperationDefinition' && operation === 'subscription'
            },
            wsLink,
            httpLink
          )
        : httpLink

    // REMOVE authLink FOR HTTPONLY_TOKEN
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      // return the headers to the context so httpLink can read them
      let access_token = ''
      let refresh_token = ''
      // do not use localStorage const item = localStorage.getItem('session') // survive a refresh
      if (item) {
        const user = JSON.parse(item)
        access_token = user.access_token
        refresh_token = user.refresh_token
      }
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${access_token}`,
          // refresh_token: refresh_token || '' // TBD - GraphQL not taking into account refresh token and revocation yet
        }
      }
    })

    const cache = new InMemoryCache() // Cache implementation

    apolloClient = new ApolloClient({
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
          for (const err of graphQLErrors) {
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
