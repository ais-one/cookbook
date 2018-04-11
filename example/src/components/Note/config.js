import moment from 'moment'
import {firestore} from '../../firebase'

export const crudTable = {
  headers: [
    { text: 'Party', value: 'party', align: 'left', sortable: false },
    { text: 'Type', value: 'type', align: 'left' },
    { text: 'Value', value: 'value', align: 'left' },
    { text: 'Date Time', value: 'datetime', align: 'left' },
    { text: 'Status', value: 'approveStatus', align: 'left' },
    { text: 'Approver', value: 'approver', align: 'left' }
  ],
  formatters: (value, _type) => {
    if (_type === 'datetime') return moment(value).format('YYYY MMM DD HH:mm')
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({
    component: import('./NotesFilter.vue')
    // loading: LoadingComp,
    // error: ErrorComp,
    // delay: 200,
    // timeout: 3000
  }),
  filterData: {
    dateStart: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD'),
    selectX: { text: 'All', value: 'all' }
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./NotesForm.vue') }),
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
  export: async (payload) => {
    try {
      const {filterData} = payload
      const {dateStart, dateEnd, selectX} = filterData
      let dbCol = firestore.collection('note')
        .where('datetime', '>=', new Date(dateStart + ' 00:00:00'))
        .where('datetime', '<=', new Date(dateEnd + ' 23:59:59'))
      if (selectX.value !== 'all') {
        dbCol = dbCol.where('approveStatus', '==', selectX.value)
      }
      dbCol = dbCol.orderBy('datetime', 'desc').limit(200)
      const rv = await dbCol.get()
      await (function () { return new Promise(resolve => setTimeout(resolve, 5000)) })() // introduce a fake delay
      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += `id,name,timestamp\r\n`
      rv.forEach(record => {
        let tmp = record.data()
        csvContent += `${record.id},${tmp.party},${tmp.datetime}\r\n`
      })
      let encodedUri = encodeURI(csvContent)
      let link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'my_data.csv')
      document.body.appendChild(link) // Required for FF
      link.click()
    } catch (e) {
      console.log(e)
    }
  },
  delete: async (payload) => {
    const {id} = payload
    try {
      await firestore.doc('note/' + id).delete()
    } catch (e) { }
  },
  find: async (payload) => {
    let records = []
    const {pagination, filterData} = payload // parentId
    const {dateStart, dateEnd, selectX} = filterData
    try {
      let dbCol = firestore.collection('note')
        .where('datetime', '>=', new Date(dateStart + ' 00:00:00'))
        .where('datetime', '<=', new Date(dateEnd + ' 23:59:59'))
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
        value: record.value,
        approver: record.approver,
        approveStatus: record.approveStatus
      })
    } catch (e) { }
  }
}
