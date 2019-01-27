import { firestore, hasDuplicate } from '@/firebase'
import { makeCsvRow, exportCsv } from '@/assets/util'
import { format } from 'date-fns'
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
    { text: 'Party Name', value: 'name', class: 'pa-1' },
    { text: 'Status', value: 'status', class: 'pa-1' }
  ],
  formatters: (value, _type) => value,
  doPage: false,
  buttons: {
    // table
    back: { icon: 'reply', label: 'Back' },
    filter: { icon: 'search', label: 'Search', icon2: 'keyboard_arrow_up' },
    reload: { icon: 'replay', label: 'Reload' },
    create: { icon: 'add', label: 'Add' },
    export: { icon: 'print', label: 'Export' },
    // form
    close: { icon: 'close', label: 'Close' },
    delete: { icon: 'delete', label: 'Delete' },
    update: { icon: 'save', label: 'Save' }
  }
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
      // this will be deprecated
      type: 'v-select',
      value: '',
      attrs: {
        label: 'Languages', // i18n.messages[i18n.locale].myApp.languages, // 'Languages', NOT WORKING... DOES NOT CHANGE
        multiple: false,
        rules: [],
        items: []
      },
      itemsFn: async () => {
        let records = []
        try {
          const rv = await firestore.collection('languages').limit(10).get() // create index
          rv.forEach(record => {
            let tmp = record.data()
            records.push(tmp.name)
          })
        } catch (e) { }
        return records
      }
    },
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
      exportCsv(csvContent, 'party.csv')
    } catch (e) { }
  },
  find: async (payload) => {
    let records = []
    const { pagination, filterData } = payload
    try {
      let dbCol = firestore.collection('party') // create index
        .where('status', '==', filterData.active.value)
      const rv = await dbCol.limit(50).get()
      rv.forEach(record => {
        let tmp = record.data()
        records.push({ id: record.id, ...tmp })
      })
    } catch (e) {
      console.log(e)
    }
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
  create: async (payload) => {
    const { record: { id, ...noIdData } } = payload
    const metaRef = firestore.collection('meta').doc('party')
    const newDocRef = firestore.collection('party').doc()
    try {
      await firestore.runTransaction(async t => {
        if (await hasDuplicate('party', 'name', noIdData['name'])) throw new Error(409)
        const meta = await t.get(metaRef)
        if (!meta.exists) {
          await t.set(metaRef, { count: 1 })
        } else {
          let tmp = meta.data()
          tmp.count++
          await t.update(metaRef, tmp)
        }
        await t.set(newDocRef, noIdData)
      })
    } catch (e) {
      if (parseInt(e.message) === 409) return 409
      else return 500
    }
    // if (await hasDuplicate('party', 'name', noIdData['name'])) return 409
    // try { await firestore.collection('party').add(noIdData) } catch (e) { return 500 }
    return 201
  },
  update: async (payload) => {
    let { record: { id, ...noIdData } } = payload
    const docRef = firestore.collection('party').doc(id)
    try {
      await firestore.runTransaction(async t => {
        const doc = await t.get(docRef)
        if (!doc.exists) throw new Error(409)
        if (await hasDuplicate('party', 'name', noIdData['name'], id)) throw new Error(409)
        await t.set(docRef, noIdData)
      })
    } catch (e) {
      if (parseInt(e.message) === 409) return 409
      else return 500
    }
    // if (await hasDuplicate('party', 'name', noIdData['name'], id)) return 409
    // try { await firestore.doc('party/' + id).update(noIdData) } catch (e) { return 500 }
    return 200
  },
  // delete: null, // TBD if delete, must also delete all dependancies, move all buttons to right?
  delete: async (payload) => {
    const { id } = payload
    const metaRef = firestore.collection('meta').doc('party')
    const docRef = firestore.collection('party').doc(id)
    try {
      await firestore.runTransaction(async t => {
        const meta = await t.get(metaRef)
        const doc = await t.get(docRef)
        if (!meta.exists) throw new Error(500)
        if (!doc.exists) throw new Error(409)
        await t.delete(docRef)
        let tmp = meta.data()
        tmp.count--
        await t.update(metaRef, tmp)
      })
    } catch (e) {
      if (parseInt(e.message) === 409) return 409
      else return 500
    }
    return 200
    // try { await firestore.collection('party').doc(id).delete() } catch (e) { return 'Delete Error' }
    // return ''
  }
}
