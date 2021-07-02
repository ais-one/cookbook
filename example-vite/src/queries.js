import gql from 'graphql-tag'

// example query
export const DO_HELLO = gql`
  query DoHello($message: String!) {
    hello(message: $message)
  }
`

// example update
export const SET_HELLO = gql`
  mutation ($body: HelloObj!) {
    setHello(body: $body)
  }
`
// setHello(body: $body) {
//   message
// }

// example subscription
export const HELLO_UPDATED = gql`
  subscription {
    helloUpdated
  }
`

// queries
export const GET_CATEGORY = gql`
  query ($id: Int!) {
    getCategory(id: $id) {
      id
      name
    }
  }
`

export const GET_CATEGORIES = gql`
  query ($page: Int!, $limit: Int!) {
    getCategories(page: $page, limit: $limit) {
      total
      results {
        id
        name
      }
    }
  }
`

// mutations
export const PATCH_CATEGORY = gql`
  mutation ($id: Int!, $body: InputCategory!) {
    patchCategory(id: $id, body: $body) {
      id
      name
    }
  }
`

export const POST_CATEGORY = gql`
  mutation ($body: InputCategory!) {
    postCategory(body: $body) {
      id
      name
    }
  }
`

/*
import { apolloClient } from '@/graphql'
import { GET_CATEGORIES, GET_CATEGORY, PATCH_CATEGORY, POST_CATEGORY } from '@/queries'
import { PAGESIZE, PAGESIZE_OPTS } from '@/config'

export default {
  pageSize: PAGESIZE,
  pageSizeOptions: PAGESIZE_OPTS,
  crud: {
    find: async ({ pagination = {}, filters = {}, sorters = {} }) => {
      let records = []
      let totalRecords = 0
      const { page, itemsPerPage } = pagination
      try {
        const rv = await apolloClient.query({ query: GET_CATEGORIES, variables: { page: page > 0 ? page - 1 : 0 ,  limit: parseInt(itemsPerPage) } })
        // console.log('ABC', rv.data.getCategories)
        records = rv.data.getCategories.results
        totalRecords = rv.data.getCategories.total
        return { status: 200, data: { records, totalRecords } }
      } catch (e) {
        console.log(e)
        return { status: 500, error: e.toString() }
      }
    },
    findOne: async (id) => {
      try {
        const rv = await apolloClient.query({ query: GET_CATEGORY, variables: { id: parseInt(id) } })
        return { status: 200, data: rv.data.getCategory }
      } catch (e) {
        return { status: 500, error: e.toString() }
      }
    },
    create: async (payload) => {
      try {
        // TBD handle errors in refetch
        let { record: { id, ...noIdData } } = payload
        await apolloClient.mutate({
          mutation: POST_CATEGORY,
          variables: {
            body: {
              name: noIdData.name
            }
          },
          // use in memory cache
          update: (cache, { data: { postCategory } }) => {
            const data = cache.readQuery({ query: GET_CATEGORIES, variables: { page: 0, limit: 2 } })
            // work with the cache data - START
            // if you are working with paging, you may want to comment the lines below out if page limit already reached. e.g
            // if (this.$refs.category.totalRecords < data.getCategories.total) {
            alert('skip this if page limit. otherwise you get extra line!')
            data.getCategories.results.push(postCategory)
            data.getCategories.total += 1
            // }
            // work with the cache data - END
            cache.writeQuery({ query: GET_CATEGORIES, data })
          },
          // data is updated immediately - why so troublesome? - WRITE TO UI FIRST BEFORE GETTING SERVER RESPONSE
          // CAVEAT - Not all fields may be updated on client... e.g. server timestamps
          // if mutation fails too bad
          optimisticResponse: {
            __typename: 'Mutation',
            postCategory: {
              __typename: 'Category',
              id: -1, // set as invalid number so no clashes with existing
              body: {
                name: noIdData.name
              }
            }
          },
          // refetchQueries - rerun queries after mutation and update the store
          // Not applicable for now as vue-crud-x reloads data after create/update/delete
          // Can set poll export default graphql(channelsListQuery, { options: { pollInterval: 5000 }, })(ChannelsList);
          refetchQueries: [
            { query: GET_CATEGORIES, variables: { page: 0, limit: 2 } }
            // add additional queries here, e.g.
            // { query: GET_SOMETHING_RELATED, variables: { pageNum: 1, pageSize: 2 } }
          ]
        })
        return { status: 201, data: null }
      } catch (e) {
        return { status: 500, error: e.toString() }
      }
    },
    update: async (payload) => {
      try {
        let { record: { id, ...noIdData } } = payload
        await apolloClient.mutate({
          mutation: PATCH_CATEGORY,
          variables: {
            id: parseInt(id), body: { name: noIdData.name }
          }
        })
        return { status: 200, data: payload.record }
      } catch (e) {
        return { status: 500, error: e.toString() }
      }
    } // done
  }
}
*/
