import moment from 'moment'
import {firestore} from '../../firebase'

export const crudTable = {
  headers: [
    { text: 'Party', value: 'party', sortable: false },
    { text: 'Type', value: 'type' },
    { text: 'Value', value: 'value' },
    { text: 'Date Time', value: 'datetime' },
    { text: 'Status', value: 'approveStatus' },
    { text: 'Approver', value: 'approver' }
  ],
  formatters: (value, _type) => {
    if (_type === 'datetime') return moment(value).format('YYYY MMM DD HH:mm')
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({ component: import('./NotesFilter2.vue') }),
  filterData: {
    dateStart: moment().subtract(45, 'days').format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD'),
    selectX: { text: 'Review', value: 'review' }
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./NotesForm2.vue') }),
  defaultRec: {
    id: null,
    approver: null,
    party: null,
    type: null,
    value: null,
    approveStatus: 'pending'
  }
}

export const crudOps = { // CRUD
  export: null,
  delete: async (payload) => {
    const {id} = payload
    try { await firestore.doc('note/' + id).delete() } catch (e) { }
  },
  find: async (payload) => {
    let records = []
    const {pagination, filterData} = payload // parentId
    const {selectX} = filterData
    try {
      let dbCol = firestore.collection('note')
      if (selectX.value !== 'all') {
        dbCol = dbCol.where('approveStatus', '==', selectX.value)
      }
      dbCol = dbCol.orderBy('datetime', 'desc').limit(200)
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
      const doc = await firestore.collection('note').doc(id).get()
      if (doc.exists) {
        record = doc.data()
        record.id = id
        record.approveStatus = {text: record.approveStatus, value: record.approveStatus}
      }
    } catch (e) { }
    return record
  },
  create: async (payload) => {
    const {record} = payload // parentId
    try {
      try {
        let data = {}
        const collectionNote = firestore.collection('note')
        data.party = record.party
        data.type = record.type
        data.value = record.value
        data.datetime = new Date()
        data.approver = ''
        data.approveStatus = 'pending'
        await collectionNote.add(data)
      } catch (e) { }
    } catch (e) { }
  },
  update: async (payload) => {
    let {user, record} = payload
    const {value} = record.approveStatus
    record.approver = (value === 'approved' || value === 'rejected') ? user.email : ''
    record.approveStatus = value
    try {
      const document = firestore.doc('note/' + record.id)
      await document.update({
        approver: record.approver,
        approveStatus: record.approveStatus
      })
    } catch (e) { }
  }
}
