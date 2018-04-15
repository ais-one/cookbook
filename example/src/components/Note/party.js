import {firestore} from '../../firebase'

export const crudTable = {
  headers: [
    { text: 'party Name', value: 'name' }
  ],
  formatters: (value, _type) => {
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({
    component: import('./PartyFilter.vue')
  }),
  filterData: {
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./PartyForm.vue') }),
  defaultRec: {
    id: '',
    name: ''
  }
}

export const crudOps = { // CRUD
  export: null,
  delete: null,
  find: async (payload) => {
    let records = []
    const {pagination} = payload
    try {
      const rv = await firestore.collection('party').limit(200).get()
      rv.forEach(record => {
        let tmp = record.data()
        records.push({id: record.id, ...tmp})
      })
    } catch (e) { }
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
    try { await firestore.collection('party').add(noIdData) } catch (e) { }
  },
  update: null
}
