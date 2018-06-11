import {firestore, hasDuplicate} from '@/firebase'
import {makeCsvRow, exportCsv} from '@/assets/util'

export const crudTable = {
  headers: [
    { text: 'Party Name', value: 'name' },
    { text: 'Status', value: 'status' }
  ],
  formatters: (value, _type) => {
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({ component: import('./PartyFilter.vue') }),
  filterData: {
    selectActive: 'active'
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./PartyForm.vue') }),
  defaultRec: {
    id: '',
    name: '',
    status: 'active',
    remarks: '',
    languages: []
  }
}

export const crudOps = { // CRUD
  export: async (payload) => {
    const {filterData} = payload // pagination
    const {selectActive} = filterData
    try {
      let dbCol = firestore.collection('party') // create index
        .where('status', '==', selectActive)
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
    const {selectActive} = filterData
    try {
      console.log('find find', filterData)
      let dbCol = firestore.collection('party') // create index
        .where('status', '==', selectActive)
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
    if (await hasDuplicate('party', 'name', noIdData['name'])) return alert('Duplicate name Found')
    try { await firestore.collection('party').add(noIdData) } catch (e) { }
  },
  update: async (payload) => {
    let {record: {id, ...noIdData}} = payload
    if (await hasDuplicate('party', 'name', noIdData['name'], id)) return alert('Duplicate name Found')
    try { await firestore.doc('party/' + id).update(noIdData) } catch (e) { }
  }
}
