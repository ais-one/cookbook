import { firestore } from '@/firebase' // hasDuplicate
import { makeCsvRow, exportCsv } from '@/assets/util'
import { format } from 'date-fns'
import { crudOps as partyCrudOps } from './party'

// set snackbar props in object to customize, or set as null to disable snackbar
export const crudSnackBar = { top: true, timeout: 6000 }

export const crudTable = {
  actionColumn: true, // action buttons (edit/delete)on the left most table column
  addrowCreate: true, // add button creates new record by adding row
  saveRow: true, // add save row button , used with inline edit only and action column
  inline: { // editable fields on the table and what type of edit are they
    // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
    'name': {
      field: 'text-field', // v-text-field (blur will update contents if it was changed)
      attrs: {
        type: 'text', // number, email, password
        class: ['caption']
      }
    },
    'remarks': {
      field: 'textarea', // edit dialog with v-textarea
      buttons: false
    },
    'languages': {
      field: 'select', // select, combobox
      attrs: {
        items: ['French', 'Thai', 'Chinese', 'Bahasa'],
        multiple: true,
        dense: true,
        class: ['caption']
      }
    },
    'created': {
      buttons: true,
      field: 'date-picker', // edit dialog with v-date-picker or v-time-picker
      attrs: { }
    },
    'photo': {
      field: 'textarea',
      buttons: true
    }
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
  FilterVue: null, // () => ({ component: null }),
  filterData: {
    // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
    // new way of defining, use attrs
    active: {
      type: 'select',
      value: 'active',
      attrs: {
        label: 'Active Status',
        multiple: false,
        items: [ 'active', 'inactive' ], // can be async loaded from db?
        rules: [v => !!v || 'Item is required']
      }
    }
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./PartyForm.vue') }),
  // FormVue: () => ({ component: null }), // not needed
  formAutoData: { // this is for automated form creation - if undefined use FormVue
    name: {
      type: 'text-field',
      halfSize: true,
      attrs: {
        label: 'Name',
        rules: [v => !!v || 'Item is required']
      }
    },
    status: {
      type: 'select',
      halfSize: true,
      attrs: {
        label: 'Active Status',
        multiple: false,
        items: [ 'active', 'inactive' ], // can be async loaded from db?
        rules: [v => !!v || 'Item is required']
      }
    },
    remarks: {
      type: 'textarea',
      attrs: {
        label: 'Remarks'
      }
    },
    photo: { type: 'hidden' },
    languages: { type: 'hidden' }
  },

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
