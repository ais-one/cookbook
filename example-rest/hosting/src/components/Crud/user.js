// import {makeCsvRow, exportCsv} from '@/assets/util'
// import {format} from 'date-fns'
import {http} from '@/axios'

// set snackbar props in object to customize, or set as null to disable snackbar
export const crudSnackBar = { top: true, timeout: 6000 }

export const crudTable = {
  inline: {
    // 'hash': 'text',
    'quotaAllocated': 'text'
  },
  confirmCreate: true,
  confirmUpdate: true,
  confirmDelete: true,
  headers: [
    { text: 'Email', value: 'email' },
    { text: 'Hash', value: 'hash' }, // use pen emoji to indicate editable columns
    { text: 'Quota', value: 'quotaAllocated' },
    { text: 'Used', value: 'quotaUsed' },
    { text: 'User Id', value: 'uid' },
    { text: 'Admin Id', value: 'adminUid' }
  ],
  formatters: (value, _type) => {
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({
    component: import('./Filter.vue')
  }),
  filterData: {
    email: {
      type: 'text',
      label: 'Email',
      value: '',
      rules: []
    }
  }
}

export const crudForm = {
  // FormVue: () => ({ component: import('./UserForm.vue') }),
  FormVue: () => ({ component: null }), // not needed
  defaultRec: () => ({ // you can use function to initialize record as well
    id: '',
    uid: '',
    email: '',
    hash: '',
    quotaAllocated: 0,
    quotaUsed: 0,
    adminUid: ''
  })
}

export const crudOps = { // CRUD
  export: null,
  // async (payload) => {
  //   const {filterData} = payload // pagination
  //   try {
  //     let dbCol = firestore.collection('party') // create index
  //       .where('status', '==', filterData.active.value)
  //     const rv = await dbCol.limit(50).get()
  //     let csvContent = ''
  //     rv.forEach(record => {
  //       let tmp = record.data()
  //       csvContent += makeCsvRow(csvContent, tmp, `\r\n`, ';')
  //     })
  //     // rv.reduce((accumulator, currentValue) => accumulator + currentValue, '')
  //     exportCsv(csvContent, 'party.csv')
  //   } catch (e) { }
  // },
  delete: async (payload) => {
    const {id} = payload
    let status = 500
    try {
      const rv = await http.delete('/user/' + id, { headers: { token: payload.user.token } })
      status = rv.status
    } catch (e) { }
    return status
  },
  find: async (payload) => {
    let records = []
    const {pagination, filterData} = payload // filterData
    // const {rowsPerPage, page} = pagination // , totalItems, sortBy, descending
    try {
      const opts = { headers: { token: payload.user.token } }
      if (filterData.email.value) opts.params = { email: filterData.email.value }
      const rv = await http.get('/user', opts)
      let index = 0
      rv.data.forEach(record => {
        records.push(record)
        index++
      })
      pagination.totalItems = index
    } catch (e) { console.log(e) }
    return {records, pagination}
  },
  findOne: null,
  create: async (payload) => {
    let {user, record} = payload
    console.log(user, record)
    let status = 500
    try {
      const rv = await http.post('/user', {
        email: record.email,
        password: record.hash
      }, { headers: { token: payload.user.token } })
      status = rv.status
    } catch (e) { }
    return status
  },
  update: async (payload) => {
    let {user, record} = payload
    console.log(user, record)
    let status = 500
    try {
      const rv = await http.put('/user/' + record.id, { quotaAllocated: record.quotaAllocated }, { headers: { token: payload.user.token } })
      status = rv.status
    } catch (e) { }
    return status
  }
}
