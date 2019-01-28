// import { makeCsvRow, exportCsv } from '@/assets/util'
import { http } from '@/axios'
// import {app} from '@/main' // to use store, router, i18n, etc...
// import i18n from '@/lang' // to use store, router, i18n, etc...
// console.log(app, i18n, i18n.messages[i18n.locale])

export const crudTable = {
  actionColumn: false,
  addrowCreate: false,
  // inline: false,
  confirmCreate: true,
  confirmUpdate: true,
  confirmDelete: true,
  headers: [
    { text: 'Author Name', value: 'name', class: 'pa-1' }
  ],
  formatters: (value, _type) => value,
  doPage: true
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
    // const { filterData } = payload // pagination
    // try {
    //   let dbCol = firestore.collection('party') // create index
    //     .where('status', '==', filterData.active.value)
    //   const rv = await dbCol.limit(50).get()

    //   let csvContent = ''
    //   rv.forEach(record => {
    //     let tmp = record.data()
    //     csvContent = makeCsvRow(csvContent, tmp, `\r\n`, ';')
    //   })
    //   exportCsv(csvContent, 'party.csv')
    // } catch (e) { }
  },
  find: async (payload) => {
    let records = []
    const { pagination } = payload // filterData // pagination: { sortBy, descending }
    const { page, rowsPerPage } = pagination
    try {
      const { data: { results, total } } = await http.get('/api/authors', {
        params: {
          page: page > 0 ? page - 1 : 0,
          limit: rowsPerPage
        }
      })
      results.forEach(row => {
        records.push(row)
      })
      pagination.totalItems = total
    } catch (e) {
      console.log(e)
    }
    return { records, pagination }
  },
  findOne: async (payload) => {
    const { id } = payload
    try {
      const { data } = await http.get(`/api/authors/${id}`)
      return data
    } catch (e) { }
    return { }
  },
  create: async (payload) => {
    try {
      let { record: { id, ...noIdData } } = payload
      const rv = await http.post('/api/authors', noIdData)
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
    try {
      let { record: { id, ...noIdData } } = payload
      const rv = await http.patch(`/api/authors/${id}`, noIdData)
      console.log(rv)
      // if (!doc.exists) throw new Error(409)
      // if (await hasDuplicate('party', 'name', noIdData['name'], id)) throw new Error(409)
      // await t.set(docRef, noIdData)
    } catch (e) {
      if (parseInt(e.message) === 409) return 409
      else return 500
    }
    return 200
  },
  delete: null // TBD if delete, must also delete all dependancies, move all buttons to right?
}
