<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x
          ref="category"
          :parentId="parentId"
          v-bind="pageDefs"
        >
        </vue-crud-x>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import { makeCsvRow, exportCsv } from '@/assets/util'
// import { http } from '@/axios'
import { apolloClient } from '@/graphql'
import { GET_CATEGORIES, GET_CATEGORY, PATCH_CATEGORY, CATEGORY_UPDATED, POST_CATEGORY } from '@/queries'

export default {
  apollo: {
    // getPosts: {
    //   query: GET_POSTS,
    //   result({ data, loading, networkStatus}) {
    //     if (!loading) {
    //       this.posts = data.getPosts
    //       console.log('[networkStatus]', networkStatus)
    //     }
    //   },
    //   error(e) {
    //     console.error('[ERROR]', e)
    //   }
    // },
    $subscribe: {
      // When a post is added
      categoryUpdated: {
        query: CATEGORY_UPDATED,
        result (data) {
          // alert('POST ADDED', data.data.postAdded.title)
          alert('SUBSCRIPTIONS: CATEGORY_UPDATED', data.data.categoryUpdated.id, data.data.categoryUpdated.name)
        }
      }
    }
  },
  name: 'category',
  data () {
    return {
      parentId: null,
      pageDefs: {
        crudTable: {
          // inline: false,
          confirmCreate: true,
          confirmUpdate: true,
          confirmDelete: true,
          formReload: false, // for Apollo GraphQL with refetch capability
          headers: [
            { text: 'Category id', value: 'id', class: 'pa-1' },
            { text: 'Category Name', value: 'name', class: 'pa-1', render: (value) => value }
          ],
          // formatters: (value, _type) => value,
          showFilterButton: false
        },
        filters: null,
        form: {
          'id': {
            type: 'v-text-field',
            value: '',
            default: '',
            hidden: 'add', // add, edit, all, null
            readonly: 'all', // add, edit, all, null
            validation: null, // validation function no in place yet
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'ID'
            }
          },
          'name': {
            type: 'v-text-field',
            value: '',
            default: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'Name',
              rules: [v => !!v || 'Item is required']
            }
          }
        },
        crudOps: { // CRUD
          export: null,
          find: async ({ pagination = {}, filters = {}, sorters = {} }) => {
            let records = []
            let totalRecords = 0
            // const { pagination } = payload // filters
            // const { page, itemsPerPage } = pagination // sortBy, descending
            // console.log('TOREMOVE', page, itemsPerPage)
            // GrqphQL
            try {
              const rv = await apolloClient.query({ query: GET_CATEGORIES })
              // console.log('ABC', rv.data.getCategories)
              records = rv.data.getCategories.results
              totalRecords = rv.data.getCategories.total
              return { status: 200, data: { records, totalRecords } }
            } catch (e) {
              console.log(e)
              return { status: 500, error: e.toString() }
            }
            // REST
            // try {
            //   const { data: { results, total } } = await http.get('/api/categories', {
            //     params: {
            //       page: page > 0 ? page - 1 : 0,
            //       limit: itemsPerPage
            //     }
            //   })
            //   // console.log(results)
            //   records = results
            //   totalRecords = total
            //   return { status: 200, data: { records, pagination, totalRecords } }
            // } catch (e) {
            //   return { status: e.response.status, error: e.toString() }
            // }
          },
          findOne: async ({ id }) => {
            // GrqphQL
            try {
              const rv = await apolloClient.query({ query: GET_CATEGORY, variables: { id: parseInt(id) } })
              return { status: 200, data: rv.data.getCategory }
            } catch (e) {
              return { status: 500, error: e.toString() }
            }
            // REST
            // try {
            //   const { data } = await http.get(`/api/categories/${id}`)
            //   return { status: 200, data }
            // } catch (e) {
            //   return { status: e.response.status, error: e.toString() }
            // }
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
                  const data = cache.readQuery({ query: GET_CATEGORIES })
                  // work with the cache data - START
                  // if you are working with paging, you may want to comment the lines below out if page limit already reached. e.g
                  // if (this.$refs.category.totalRecords < data.getCategories.total) {
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
                    _id: -1, // set as invalid number so no clashes with existing
                    body: {
                      name: noIdData.name
                    }
                  }
                },
                // refetchQueries - rerun queries after mutation and update the store
                // Not applicable for now as vue-crud-x reloads data after create/update/delete
                // Can set poll export default graphql(channelsListQuery, { options: { pollInterval: 5000 }, })(ChannelsList);
                refetchQueries: [
                  { query: GET_CATEGORIES }
                  // add additional queries here, e.g.
                  // { query: GET_SOMETHING_RELATED, variables: { pageNum: 1, pageSize: 2 } }
                ]
              })
              return { status: 201, data: null }
            } catch (e) {
              return { status: 500, error: e.toString() }
            }
            // try {
            //   let { record: { id, ...noIdData } } = payload
            //   // const rv =
            //   const { data } = await http.post('/api/categories', noIdData)
            //   return { status: 201, data }
            // } catch (e) {
            //   return { status: e.response.status, error: e.toString() }
            // }
          },
          update: async (payload) => {
            // GrqphQL
            // console.log(payload)
            try {
              let { record: { id, ...noIdData } } = payload
              console.log(noIdData)
              // const rv =
              await apolloClient.mutate({
                mutation: PATCH_CATEGORY,
                variables: {
                  id: parseInt(id),
                  body: {
                    name: noIdData.name
                  }
                }
              })
              // console.log('rv', rv)
              return { status: 200, data: null }
            } catch (e) {
              return { status: 500, error: e.toString() }
            }
            // REST
            // try {
            //   let { record: { id, ...noIdData } } = payload
            //   const { data } = await http.patch(`/api/categories/${id}`, noIdData)
            //   return { status: 200, data }
            // } catch (e) {
            //   return { status: e.response.status, error: e.toString() }
            // }
          },
          delete: null
        }
      }
    }
  }
}
</script>
