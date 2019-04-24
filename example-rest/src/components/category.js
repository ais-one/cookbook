// import { makeCsvRow, exportCsv } from '@/assets/util'
import { http } from '@/axios'
import { apolloClient } from '@/graphql'
import { GET_CATEGORIES, GET_CATEGORY, PATCH_CATEGORY } from '@/queries'

export const crudTable = {
  actionColumn: false,
  addrowCreate: false,
  // inline: false,
  confirmCreate: true,
  confirmUpdate: true,
  confirmDelete: true,
  headers: [
    { text: 'Category Name', value: 'name', class: 'pa-1' }
  ],
  formatters: (value, _type) => value,
  doPage: 2,
  showFilterButton: false
}

export const crudFilter = {
  FilterVue: null,
  filterData: { }
}

export const crudForm = {
  FormVue: null,
  formAutoData: {
    id: { type: 'input', attrs: { hidden: true } }, // need id if there is delete
    name: {
      type: 'v-text-field',
      attrs: {
        label: 'Name',
        rules: [v => !!v || 'Item is required']
      },
      halfSize: false
    }
  },
  defaultRec: () => ({
    id: '',
    name: ''
  })
}

export const crudOps = { // CRUD
  export: async (payload) => {
  },
  find: async (payload) => {
    let records = []
    let totalRecords = 0
    const { pagination } = payload // filterData
    const { page, rowsPerPage } = pagination // sortBy, descending
    console.log('TOREMOVE', page, rowsPerPage)
    // GrqphQL
    try {
      const rv = await apolloClient.query({ query: GET_CATEGORIES })
      records = rv.data.getCategories.results
      totalRecords = rv.data.getCategories.total
      // console.log('ABC', rv.data.getCategories)
    } catch (e) {
      console.log(e)
    }
    // REST
    // try {
    //   const { data: { results, total } } = await http.get('/api/categories', {
    //     params: {
    //       page: page > 0 ? page - 1 : 0,
    //       limit: rowsPerPage
    //     }
    //   })
    //   // console.log(results)
    //   records = results
    //   totalRecords = total
    // } catch (e) {
    //   console.log(e)
    // }
    return { records, pagination, totalRecords }
  },
  findOne: async (payload) => {
    const { id } = payload
    // GrqphQL
    try {
      const rv = await apolloClient.query({ query: GET_CATEGORY, variables: { id: parseInt(id) } })
      // console.log('rv', rv)
      return rv.data.getCategory
    } catch (e) { }
    // REST
    // try {
    //   const { data } = await http.get(`/api/categories/${id}`)
    //   return data
    // } catch (e) { }
    // return { }
  },
  create: async (payload) => {
    try {
      let { record: { id, ...noIdData } } = payload
      const rv = await http.post('/api/categories', noIdData)
      console.log(rv)
    } catch (e) {
      return 500
    }
    // return { // EXAMPLE return object with code property omitted
    //   ok: true,
    //   msg: 'OK'
    // }
    return 201
  },
  update: async (payload) => {
    // GrqphQL
    // console.log(payload)
    try {
      let { record: { id, ...noIdData } } = payload

      console.log(noIdData)
      const rv = await apolloClient.mutate({
        mutation: PATCH_CATEGORY,
        variables: {
          id: parseInt(id),
          body: {
            name: noIdData.name
          }
        }
      })
      console.log('rv', rv)
    } catch (e) {
      if (parseInt(e.message) === 409) return 409
      else return 500
    }
    // REST
    // try {
    //   let { record: { id, ...noIdData } } = payload
    //   const rv = await http.patch(`/api/categories/${id}`, noIdData)
    //   console.log(rv)
    //   // if (!doc.exists) throw new Error(409)
    //   // if (await hasDuplicate('party', 'name', noIdData['name'], id)) throw new Error(409)
    //   // await t.set(docRef, noIdData)
    // } catch (e) {
    //   if (parseInt(e.message) === 409) return 409
    //   else return 500
    // }
    return 200
  },
  delete: null // TBD if delete, must also delete all dependancies, move all buttons to right?
}
