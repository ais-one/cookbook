import {firestore, hasDuplicate} from '@/firebase'
import {makeCsvRow, exportCsv} from '@/assets/util'
import {format} from 'date-fns'

// set snackbar props in object to customize, or set as null to disable snackbar
export const crudSnackBar = { top: true, timeout: 6000 }

export const crudTable = {
  inline: {
    'remarks': 'text',
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
  }
}

export const crudFilter = {
  FilterVue: () => ({
    component: import('./Filter.vue')
  }),
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
  FormVue: () => ({ component: null }), // not needed
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
    const {filterData} = payload // pagination
    try {
      let dbCol = firestore.collection('party') // create index
        .where('status', '==', filterData.active.value)
      const rv = await dbCol.limit(200).get()

      let csvContent = ''
      rv.forEach(record => {
        let tmp = record.data()
        csvContent += makeCsvRow(csvContent, tmp, `\r\n`, ';')
      })
      exportCsv(csvContent, 'party.csv')
    } catch (e) { }
  },
  delete: async (payload) => {
    const {id} = payload
    try { await firestore.doc('party/' + id).delete() } catch (e) { return 'Delete Error' }
    return 'Delete OK'
  },
  find: async (payload) => {
    let records = []
    const {pagination, filterData} = payload
    try {
      let dbCol = firestore.collection('party') // create index
        .where('status', '==', filterData.active.value)
      const rv = await dbCol.limit(200).get()
      rv.forEach(record => {
        let tmp = record.data()
        records.push({id: record.id, ...tmp})
      })
    } catch (e) {
      console.log(e)
    }
    return {records, pagination}
  },
  findOne: async (payload) => {
    const {id} = payload
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
  create: async (payload) => {
    const {record: {id, ...noIdData}} = payload
    if (await hasDuplicate('party', 'name', noIdData['name'])) return 'Duplicate Found'
    try { await firestore.collection('party').add(noIdData) } catch (e) { return 'Create Error' }
    return 'Create OK'
  },
  update: async (payload) => {
    let {record: {id, ...noIdData}} = payload
    if (await hasDuplicate('party', 'name', noIdData['name'], id)) return 'Duplicate Found'
    try { await firestore.doc('party/' + id).update(noIdData) } catch (e) { return 'Update Error' }
    return 'Update OK'
  }
}
