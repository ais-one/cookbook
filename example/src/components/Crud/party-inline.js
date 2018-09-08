import { firestore } from '@/firebase' // hasDuplicate
import { makeCsvRow, exportCsv } from '@/assets/util'
import { format } from 'date-fns'
import { crudOps as partyCrudOps } from './party'

// set snackbar props in object to customize, or set as null to disable snackbar
export const crudSnackBar = { top: true, timeout: 6000 }

export const crudTable = {
  actionColumn: true, // action buttons (edit/delete)on the left most table column
  addrowCreate: true, // add button creates new record by adding row
  inline: { // editable fields on the table and what type of edit are they
    'name': 'text', // v-text-field (blur will update contents if it was changed)
    'remarks': 'textarea', // edit dialog with v-textarea
    'created': 'date', // edit dialog with v-date-picker
    'photo': 'textdialog' // edit dialog with v-text-field (text)
  },
  inlineButtons: true,
  confirmCreate: true, // show operation confirmation dialog flags
  confirmUpdate: true,
  confirmDelete: true,
  headers: [
    { text: 'Party Name', value: 'name', fixed: true },
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
  crudTitle: 'Custom Title',

  onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
  onRowClickOpenForm: true, // set to false of you do not want row click to open form

  doPage: true, // pagination enabled
  fullscreenForm: false, // dialog form is not fullscreen

  isFluid: true, // fluid layout
  hideHeaders: false, // do not hide headers
  showGoBack: false, // do net show go back button on table

  dark: false, // setting theme and colors
  fab: false,
  noDataColor: 'grey',
  formToolbarColor: 'grey',
  filterHeaderColor: 'grey'
}

export const crudFilter = {
  hasFilterVue: false,
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
