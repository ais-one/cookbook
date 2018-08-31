import { firestore } from '@/firebase' // hasDuplicate
import { makeCsvRow, exportCsv } from '@/assets/util'
import { format } from 'date-fns'
import { crudOps as partyCrudOps } from './party'

// set snackbar props in object to customize, or set as null to disable snackbar
export const crudSnackBar = { top: true, timeout: 6000 }

export const crudTable = {
  actionColumn: true,
  addrowCreate: true,
  inline: {
    'name': 'text',
    'remarks': 'textarea',
    'created': 'date'
  },
  confirmCreate: true,
  confirmUpdate: true,
  confirmDelete: true,
  headers: [
    { text: 'Party Name', value: 'name' },
    { text: 'Remarks🖊️', value: 'remarks' }, // use pen emoji to indicate editable columns
    { text: 'Languages', value: 'languages' },
    { text: 'Status', value: 'status' },
    { text: 'Created🖊️', value: 'created' },
    { text: 'Photo URL', value: 'photo' }
  ],
  formatters: (value, _type) => {
    if (_type === 'languages') return value.join(',')
    return value
  },
  doPage: true,
  crudTitle: 'Custom Title',

  isFluid: true, // some styling
  hideHeaders: false
}

export const crudFilter = {
  FilterVue: () => ({ component: null }),
  filterData: {
    active: {
      type: 'select',
      label: 'Active Status',
      multiple: false,
      items: [ 'active', 'inactive' ], // can be async loaded from db?
      value: 'active',
      rules: [v => !!v || 'Item is required']
    }
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./PartyForm.vue') }),
  // FormVue: () => ({ component: null }), // not needed
  defaultRec: () => ({ // you can use function to initialize record as well
    id: '',
    name: '',
    status: 'active',
    remarks: '',
    languages: [],
    created: format(new Date(), 'YYYY-MM-DD HH:mm:ss'), // set value during setRecord() function
    photo: ''
  })
}

export const crudOps = { // CRUD
  export: async (payload) => {
    const { filterData } = payload // pagination
    try {
      let dbCol = firestore.collection('party') // create index
        .where('status', '==', filterData.active.value)
      const rv = await dbCol.limit(50).get()
      let csvContent = ''
      rv.forEach(record => {
        let tmp = record.data()
        csvContent += makeCsvRow(csvContent, tmp, `\r\n`, ';')
      })
      // rv.reduce((accumulator, currentValue) => accumulator + currentValue, '')
      exportCsv(csvContent, 'party.csv')
    } catch (e) { }
  },
  find: async (payload) => {
    let records = []
    const { pagination, filterData } = payload
    const { rowsPerPage, page } = pagination // , totalItems, sortBy, descending
    try {
      // no need to get meta yet
      // const meta = await firestore.collection('meta').doc('party').get()
      // if (meta.exists) pagination.totalItems = meta.data().count
      let dbCol = firestore.collection('party').where('status', '==', filterData.active.value)
      const rv = await dbCol.limit(50).get()
      let index = 0
      rv.forEach(record => {
        let tmp = record.data()
        if (
          (index >= (page - 1) * rowsPerPage && index < page * rowsPerPage)
        ) {
          records.push({ id: record.id, ...tmp })
        }
        index++
      })
      pagination.totalItems = index
    } catch (e) { console.log(e) }
    return { records, pagination }
  },
  findOne: async (payload) => {
    const { id } = payload
    let record = { }
    try {
      const doc = await firestore.collection('party').doc(id).get()
      if (doc.exists) {
        record = doc.data()
        record.id = id
      }
    } catch (e) { }
    return record
  },
  create: partyCrudOps.create,
  update: partyCrudOps.update,
  delete: partyCrudOps.delete
}
