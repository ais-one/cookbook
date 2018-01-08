import {firestore} from '../../firebase'

export const crudTable = {
  headers: [
    { text: 'Id', value: 'id', align: 'left' },
    { text: 'Note Id', value: 'noteId', align: 'left' },
    { text: 'Info', value: 'info', align: 'left' },
    { text: 'Active', value: 'active', align: 'left' }
  ],
  formatters: (value, _type) => {
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({ component: import('./NotesFilterS.vue') }),
  filterData: {
    selectY: { text: 'active', value: true }
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./NotesFormS.vue') }),
  defaultRec: {
    id: null,
    info: '',
    active: true
  }
}

export const crudOps = { // CRUD
  delete: async (payload) => {
    const {id} = payload
    try {
      await firestore.doc('subnote/' + id).delete()
    } catch (e) { }
  },
  find: async (payload) => {
    let records = []
    const {
      pagination,
      addons: {
        parentId
      }
    } = payload
    try {
      // const {active} = payload.filterData
      let dbCol = firestore.collection('subnote')
        .where('noteId', '==', parentId)
        // .where('active', '==', active)
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
    const {
      record: {active, info},
      addons: {parentId}
    } = payload
    try {
      let data = {}
      const collectionNote = firestore.collection('subnote')
      data.noteId = parentId
      data.active = active
      data.info = info
      await collectionNote.add(data)
    } catch (e) { }
  },
  update: async (payload) => {
    let {
      record: {id, noteId, info, active}
    } = payload
    try {
      const document = firestore.doc('subnote/' + id)
      await document.update({
        noteId,
        active,
        info
      })
    } catch (e) { }
  }
}
