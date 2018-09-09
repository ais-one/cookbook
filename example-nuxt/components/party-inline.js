import {firestore, hasDuplicate} from '@/firebase'
import {format} from 'date-fns'

// set snackbar props in object to customize, or set as null to disable snackbar
export const crudSnackBar = { top: true, timeout: 6000 }

export const crudTable = {
  inline: {
    'name': 'text',
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
  export: null,
  delete: async (payload) => {
    const {id} = payload
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
  },
  find: async (payload) => {
    let records = []
    const {pagination, filterData} = payload
    const {rowsPerPage, page} = pagination // , totalItems, sortBy, descending
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
          records.push({id: record.id, ...tmp})
        }
        index++
      })
      pagination.totalItems = index
    } catch (e) { console.log(e) }
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
    const metaRef = firestore.collection('meta').doc('party')
    const newDocRef = firestore.collection('party').doc()
    try {
      await firestore.runTransaction(async t => {
        if (await hasDuplicate('party', 'name', noIdData['name'])) throw new Error(409)
        const meta = await t.get(metaRef)
        if (!meta.exists) throw new Error(500)
        await t.set(newDocRef, noIdData)
        let tmp = meta.data()
        tmp.count++
        await t.update(metaRef, tmp)
      })
    } catch (e) {
      if (parseInt(e.message) === 409) return 409
      else return 500
    }
    return 201
    // if (await hasDuplicate('party', 'name', noIdData['name'])) return 'Duplicate Found'
    // try { await firestore.collection('party').add(noIdData) } catch (e) { return 'Create Error' }
    // return ''
  },
  update: async (payload) => {
    let {record: {id, ...noIdData}} = payload
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
    return 200
    // if (await hasDuplicate('party', 'name', noIdData['name'], id)) return 409
    // try { await firestore.doc('party/' + id).update(noIdData) } catch (e) { return 500 }
    // return 200
  }
}
