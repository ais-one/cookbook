import { firestore } from '@/firebase' // hasDuplicate
import { makeCsvRow, exportCsv } from '@/assets/util'
import { format } from 'date-fns'
import { crudOps as partyCrudOps } from './party'

export const crudTable = {
  saveRow: '#ffaaaa', // add save row button & specify color when row is changed, used with inline edit only and action column
  inlineReload: { // default true, set to false and use snapshot for large firestore dataset (or similar mechanisms where reads are chargeable)
    update: false,
    create: true,
    delete: true
  },
  addrowCreate: [
    {
      field: 'name',
      label: 'Name'
    }
  ], // add button creates new record by adding row, you can specified fields that use needs to pre-enter data,
  // empty array if no need to,
  // false if no need addrowCreate button
  inline: { // editable fields on the table and what type of edit are they
    // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
    'name': {
      field: 'v-text-field', // v-text-field (blur will update contents if it was changed)
      attrs: {
        type: 'text', // number, email, password
        class: ['caption']
      }
    },
    'remarks': {
      field: 'v-textarea', // edit dialog with v-textarea
      buttons: false
    },
    'languages': {
      field: 'v-select', // select, combobox
      attrs: {
        items: ['French', 'Thai', 'Chinese', 'Bahasa'],
        multiple: true,
        dense: true,
        class: ['caption']
      }
    },
    'created': {
      buttons: true,
      field: 'v-date-picker', // edit dialog with v-date-picker or v-time-picker
      attrs: { }
    },
    'photo': {
      field: 'v-textarea',
      buttons: true
    }
    // base: { field: 'v-btn-toggle', attrs: { }, group: { type: 'v-btn', attrs: { flat: true, block: true }, items: { 'WCP': 'WCP', 'MSP': 'MSP' } } },
  },
  confirmCreate: true, // show operation confirmation dialog flags
  confirmUpdate: true,
  confirmDelete: true,
  // REMOVE THIS, NO LONGER NEEDED: actionColumn: true, // action buttons (edit/delete)on the left most table column
  headers: [
    { text: 'Action', value: '', align: 'center', sortable: false, class: 'pa-1 text-xs-center' }, // IMPORTANT: blank value means it is action column
    { text: 'Party Name', value: 'name' },
    { text: 'Remarks', value: 'remarks', align: 'right', class: 'pa-1', 'cell-class': 'text-xs-right pa-1' }, // align header and cell
    { text: 'Languages', value: 'languages' },
    { text: 'Status', value: 'status' },
    { text: 'Created', value: 'created' },
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
  showGoBack: false, // do net show go back button on table
  showFilterButton: true, // show expand filter button on toolbar? if hide means you do not want user to play with the filters

  attrs: {
    // you can add attributes used by the component and customize style and classes
    snackbar: { // v-snackbar Component - null means no snack bar
      bottom: true,
      timeout: 6000
    },
    container: { // v-container Component
      fluid: true,
      class: 'pa-0',
      style: { } // you can add more styles here
    },
    dialog: { // v-dialog Component
      fullscreen: false, // dialog form is not fullscreen
      scrollable: true,
      transition: 'dialog-bottom-transition',
      overlay: false
    },
    form: { // v-form Component
      class: 'grey lighten-3 pa-2',
      'lazy-validation': true
    },
    alert: { // v-alert Component
      color: 'grey',
      icon: ''
    },
    toolbar: { // v-toolbar Component
      height: 48,
      dark: false,
      light: true,
      color: 'grey'
    },
    table: { // v-data-table Component
      dark: false,
      light: true,
      'rows-per-page-items': [2, 5, 10, 20],
      'hide-headers': false,
      'loading-color': '#ff0000'
    },
    button: { // v-btn Component
      dark: false,
      light: true,
      icon: true,
      fab: false
    },
    'v-progress-linear': { // v-progress-linear, can also be v-progress-circular
      class: 'ma-0'
    },
    'edit-indicator-left': '🖊️',
    'edit-indicator-right': '',
    'action-icon': { // for the action column
      small: true,
      class: 'mr-1'
    },
    buttons: {
      // table
      back: { icon: 'reply', label: '' },
      filter: { icon: 'search', label: '', icon2: 'keyboard_arrow_up' },
      reload: { icon: 'replay', label: '' },
      create: { icon: 'add', label: '' },
      export: { icon: 'print', label: '' },
      // form
      close: { icon: 'close', label: '' },
      delete: { icon: 'delete', label: '' },
      update: { icon: 'save', label: '' }
    }
  }
}

export const crudFilter = {
  FilterVue: null,
  filterData: {
    // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
    // new way of defining, use attrs
    active: {
      type: 'v-select',
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
  // FormVue: null, // not needed
  formAutoData: { // this is for automated form creation - if undefined use FormVue
    id: { type: 'input', attrs: { hidden: true } }, // need id if there is delete
    name: {
      type: 'v-text-field',
      halfSize: true,
      attrs: {
        label: 'Name',
        rules: [v => !!v || 'Item is required']
      }
    },
    status: {
      type: 'v-select',
      halfSize: true,
      attrs: {
        label: 'Active Status',
        multiple: false,
        items: [ 'active', 'inactive' ], // can be async loaded from db?
        rules: [v => !!v || 'Item is required']
      }
    },
    remarks: {
      type: 'v-textarea',
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
        csvContent = makeCsvRow(csvContent, tmp, `\r\n`, ';')
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
