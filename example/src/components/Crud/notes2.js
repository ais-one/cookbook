import { firestore } from '@/firebase'
import { format } from 'date-fns'

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
    if (_type === 'datetime') return format(value.toDate(), 'YYYY MMM DD HH:mm')
    return value
  }
}

export const crudFilter = {
  FilterVue: null, // () => ({ component: null }),
  filterData: {
    selectX: {
      type: 'v-select',
      value: { text: 'All', value: 'all' },
      attrs: {
        label: 'Active Status',
        multiple: false,
        items: [
          { text: 'All', value: 'all' },
          { text: 'Pending', value: 'pending' },
          { text: 'Review', value: 'review' },
          { text: 'Approved', value: 'approved' },
          { text: 'Rejected', value: 'rejected' }
        ],
        rules: [v => !!v || 'Item is required']
      }
    }
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
    const { id } = payload
    try { await firestore.doc('note/' + id).delete() } catch (e) { return 500 }
    return 200
  },
  find: async (payload) => {
    let records = []
    const { pagination, filterData } = payload // parentId
    const { selectX } = filterData
    try {
      let dbCol = firestore.collection('note')
      if (selectX.value.value !== 'all') {
        dbCol = dbCol.where('approveStatus', '==', selectX.value.value)
      }
      dbCol = dbCol.orderBy('datetime', 'desc').limit(200)
      const rv = await dbCol.get()
      rv.forEach(record => {
        let tmp = record.data()
        tmp.id = record.id
        records.push(tmp)
      })
    } catch (e) { }
    return { records, pagination }
  },
  findOne: async (payload) => {
    const { id } = payload
    let record = { }
    try {
      const doc = await firestore.collection('note').doc(id).get()
      if (doc.exists) {
        record = doc.data()
        record.id = id
        record.approveStatus = { text: record.approveStatus, value: record.approveStatus }
      }
    } catch (e) { }
    return record
  },
  create: async (payload) => {
    const { record } = payload // parentId
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
    } catch (e) { return 500 }
    return 201
  },
  update: async (payload) => {
    let { user, record } = payload
    const { value } = record.approveStatus
    record.approver = (value === 'approved' || value === 'rejected') ? user.email : ''
    record.approveStatus = value
    try {
      const document = firestore.doc('note/' + record.id)
      await document.update({
        approver: record.approver,
        approveStatus: record.approveStatus
      })
    } catch (e) { return 500 }
    return 200
  }
}
