import {http} from '@/axios'
import {startOfMonth, endOfMonth, format} from 'date-fns'

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
    { text: 'User Id', value: 'uid' },
    { text: 'Admin Id', value: 'adminUid' },
    { text: 'Resource ID', value: 'resourceId' },
    { text: 'Created Date', value: 'createdDate' }
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
    from: {
      type: 'date',
      label: 'Date Created - From',
      value: format(startOfMonth(new Date()), 'YYYY-MM-DD'),
      rules: [
        (v) => (v <= crudFilter.filterData.dateEnd.value) || 'Start date must be earlier or same as end date'
      ]
    },
    to: {
      type: 'date',
      label: 'Date Created - To',
      value: format(endOfMonth(new Date()), 'YYYY-MM-DD'),
      rules: [
        (v) => (v >= crudFilter.filterData.dateStart.value) || 'End date must be later or same as start date'
      ]
    }
  }
}

export const crudForm = {
  FormVue: () => ({ component: null }), // not needed
  defaultRec: () => ({ // you can use function to initialize record as well
    id: '',
    uid: '',
    adminUid: '',
    resourceId: '',
    createdDate: ''
  })
}

export const crudOps = { // CRUD
  export: null,
  delete: async (payload) => {
    const {id} = payload
    let status = 500
    try {
      const rv = await http.delete('/resource/' + id, { headers: { token: payload.user.token } })
      status = rv.status
    } catch (e) { }
    return status
  },
  find: async (payload) => {
    let records = []
    const {pagination, filterData} = payload
    // const {rowsPerPage, page} = pagination // , totalItems, sortBy, descending
    try {
      const opts = { headers: { token: payload.user.token } }
      if (filterData.from.value && filterData.to.value) {
        opts.params = {
          from: filterData.from.value,
          to: filterData.to.value
        }
      }
      const rv = await http.get('/resource', opts)
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
    // let {user, record} = payload
    // console.log(user, record)
    let status = 500
    try {
      const rv = await http.post('/resource', {
      }, { headers: { token: payload.user.token } })
      status = rv.status
    } catch (e) { }
    return status
  },
  update: null
}
