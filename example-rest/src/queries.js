import gql from 'graphql-tag'

// queries
export const DO_HELLO = gql`
  query DoHello($message: String!) {
    hello(message: $message)
  }
`

export const GET_CATEGORY = gql`
  query($id: Int!) {
    getCategory(id: $id) {
      id
      name
    }
  }
`
export const GET_CATEGORIES = gql`
  query {
    getCategories {
      id
      name
    }
  }
`

// mutations
export const PATCH_CATEGORY = gql`
  mutation($id: Int!, $username: String!) {
    putCategory(id: $id, username: $username) {
      id
      name
    }
  }
`

export const POST_CATEGORY = gql`
  mutation($name: String!) {
    putCategory(name: $name) {
      id
      name
    }
  }
`

// subscriptions
export const CATEGORY_ADDED = gql`
  subscription {
    categoryAdded {
      id
      name
    }
  }
`

export const CATEGORY_UPDATED = gql`
  subscription {
    categoryUpdated {
      id
      name
    }
  }
`
