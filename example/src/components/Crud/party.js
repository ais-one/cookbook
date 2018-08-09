import {firestore, hasDuplicate} from '@/firebase'
import {makeCsvRow, exportCsv} from '@/assets/util'
import {format} from 'date-fns'
// import {app} from '@/main' // to use store, router, i18n, etc...
// import i18n from '@/lang' // to use store, router, i18n, etc...

// console.log(app, i18n, i18n.messages[i18n.locale])

// set snackbar props in object to customize, or set as null to disable snackbar
export const crudSnackBar = { top: true, timeout: 6000 }

export const crudTable = {
  inline: null,
  confirmCreate: true,
  confirmUpdate: true,
  confirmDelete: true,
  headers: [
    { text: 'Party Name', value: 'name' },
    { text: 'Status', value: 'status' }
  ],
  formatters: (value, _type) => value
}

export const crudFilter = {
  FilterVue: () => ({
    component: import('./Filter.vue')
    // loading: LoadingComp,
    // error: ErrorComp,
    // delay: 200,
    // timeout: 3000
  }),
  filterData: {
    languages: {
      type: 'select',
      label: 'Languages', // i18n.messages[i18n.locale].myApp.languages, // 'Languages', NOT WORKING... DOES NOT CHANGE
      multiple: false,
      rules: [],
      value: '',
      itemsFn: async () => {
        let records = []
        try {
          const rv = await firestore.collection('languages').limit(200).get() // create index
          rv.forEach(record => {
            let tmp = record.data()
            records.push(tmp.name)
          })
        } catch (e) { }
        return records
      },
      items: [ ]
    },
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
  // defaultRec: {
  //   id: '',
  //   name: '',
  //   status: 'active',
  //   remarks: '',
  //   languages: [],
  //   created: '' // set value in the create() function
  //   photo: ''
  // }
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
  delete: null, // TBD if delete, must also delete all dependancies, move all buttons to right?
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
