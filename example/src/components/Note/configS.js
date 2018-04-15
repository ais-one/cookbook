import {firestore} from '../../firebase'

export const crudTable = {
  headers: [
    { text: 'Id', value: 'id', align: 'left' },
    { text: 'Note Id', value: 'noteId' },
    { text: 'Info', value: 'info' },
    { text: 'Status', value: 'active' }
  ],
  formatters: (value, _type) => {
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({ component: import('./NotesFilterS.vue') }),
  filterData: {
    selectActive: 'active'
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./NotesFormS.vue') }),
  defaultRec: {
    id: null,
    info: '',
    active: 'active'
  }
}

export const crudOps = { // CRUD
  export: null,
  delete: async (payload) => {
    const {id} = payload
    try { await firestore.doc('subnote/' + id).delete() } catch (e) { }
  },
  find: async (payload) => {
    let records = []
    let {pagination, parentId, filterData} = payload
    const {selectActive} = filterData
    console.log(parentId, filterData)
    try {
      let dbCol = firestore.collection('subnote') // create index
        .where('noteId', '==', parentId)
        .where('active', '==', selectActive)
      const rv = await dbCol.get()
      rv.forEach(record => {
        let tmp = record.data()
        tmp.id = record.id
        records.push(tmp)
      })
    } catch (e) { }
    return {records, pagination}
  },
  findOne: async (payload) => {
    const {id} = payload
    let record = { }
    try {
      const doc = await firestore.collection('subnote').doc(id).get()
      if (doc.exists) {
        record = doc.data()
        record.id = id
      }
    } catch (e) { }
    return record
  },
  create: async (payload) => {
    const {record: {id, ...noIdData}, parentId} = payload
    try { await firestore.collection('subnote').add({noteId: parentId, ...noIdData}) } catch (e) { }
  },
  update: async (payload) => {
    let {record: {id, ...noIdData}} = payload
    console.log(id, noIdData)
    try { await firestore.doc('subnote/' + id).update(noIdData) } catch (e) { }
  }
}
