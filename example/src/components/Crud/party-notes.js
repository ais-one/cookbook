import {firestore} from '@/firebase'
import {makeCsvRow, exportCsv} from '@/assets/util'
import {format, subDays, differenceInCalendarDays} from 'date-fns'

export const crudTable = {
  headers: [
    { text: 'Party', value: 'party', align: 'left', sortable: false },
    { text: 'Type', value: 'type' },
    { text: 'Value', value: 'value' },
    { text: 'Date Time', value: 'datetime' },
    { text: 'Status', value: 'approveStatus' },
    { text: 'Approver', value: 'approver' }
  ],
  formatters: (value, _type) => {
    if (_type === 'datetime') return format(value, 'YYYY MMM DD HH:mm')
    return value
  }
}

export const crudFilter = {
  FilterVue: () => ({
    component: import('./Filter.vue')
  }),
  filterData: {
    // dateStart: format(subDays(new Date(), 20), 'YYYY-MM-DD'),
    // dateEnd: format(new Date(), 'YYYY-MM-DD'),
    // selectX: { text: 'All', value: 'all' },
    dateStart: {
      type: 'date',
      label: 'Date Start',
      value: format(subDays(new Date(), 20), 'YYYY-MM-DD'),
      rules: [
        (v) => (v <= crudFilter.filterData.dateEnd.value) || 'Start date must be earlier or same as end date',
        (v) => (differenceInCalendarDays(crudFilter.filterData.dateEnd.value, v) <= 60) || 'Select only up to 60 days of records at a time'
      ]
    },
    dateEnd: {
      type: 'date',
      label: 'Date End',
      value: format(new Date(), 'YYYY-MM-DD'),
      rules: [
        (v) => (v >= crudFilter.filterData.dateStart.value) || 'End date must be later or same as start date',
        (v) => (differenceInCalendarDays(v, crudFilter.filterData.dateStart.value) <= 60) || 'Select only up to 60 days of records at a time'
      ]
    },
    selectX: {
      type: 'select-kv',
      label: 'Active Status',
      multiple: false,
      items: [
        { text: 'All', value: 'all' },
        { text: 'Pending', value: 'pending' },
        { text: 'Review', value: 'review' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' }
      ],
      value: { text: 'All', value: 'all' },
      rules: [v => !!v || 'Item is required']
    }
  }
}

export const crudForm = {
  FormVue: () => ({ component: import('./PartyNotesForm.vue') }),
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
      const {filterData, parentId} = payload
      const {dateStart, dateEnd, selectX} = filterData
      let dbCol = firestore.collection('note')
        .where('party', '==', parentId)
        .where('datetime', '>=', new Date(dateStart.value + ' 00:00:00')) // create index
        .where('datetime', '<=', new Date(dateEnd.value + ' 23:59:59'))
      if (selectX.value !== 'all') {
        dbCol = dbCol.where('approveStatus', '==', selectX.value.value)
      }
      dbCol = dbCol.orderBy('datetime', 'desc').limit(200)
      const rv = await dbCol.get()
      await (function () { return new Promise(resolve => setTimeout(resolve, 5000)) })() // introduce a fake delay

      let csvContent = ''
      rv.forEach(record => {
        let tmp = record.data()
        csvContent += makeCsvRow(csvContent, tmp, `\r\n`, ';')
      })
      exportCsv(csvContent, 'party-notes.csv')
    } catch (e) { }
  },
  delete: async (payload) => {
    const {id} = payload
    try { await firestore.doc('note/' + id).delete() } catch (e) { return 'Delete Error' }
    return 'Delete OK'
  },
  find: async (payload) => {
    let records = []
    const {pagination, parentId, filterData} = payload // parentId
    const {dateStart, dateEnd, selectX} = filterData
    const {rowsPerPage, totalItems, sortBy, descending} = pagination
    console.log('aa', rowsPerPage, totalItems, sortBy, descending)
    console.log('bb', filterData, selectX, dateStart.value, dateEnd.value)
    try {
      let dbCol = firestore.collection('note')
        .where('party', '==', parentId)
        .where('datetime', '>=', new Date(dateStart.value + ' 00:00:00')) // create index
        .where('datetime', '<=', new Date(dateEnd.value + ' 23:59:59'))
      if (selectX.value.value !== 'all') {
        dbCol = dbCol.where('approveStatus', '==', selectX.value.value)
      }
      if (sortBy === 'datetime') {
        const order = descending ? 'desc' : 'asc'
        dbCol = dbCol.orderBy(sortBy, order).limit(200)
      }
      const rv = await dbCol.get()
      rv.forEach(record => {
        let tmp = record.data()
        tmp.id = record.id
        records.push(tmp)
      })
    } catch (e) {
      console.log(e) // if there is indexing error, use this output to help create the required indexes
    }
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
    const {record, parentId} = payload
    try {
      let data = {}
      const collectionNote = firestore.collection('note')
      data.party = parentId
      data.type = record.type
      data.value = record.value
      data.datetime = new Date()
      data.approver = ''
      data.approveStatus = 'pending'
      await collectionNote.add(data)
    } catch (e) { return 'Create Error' }
    return 'Create OK'
  },
  update: async (payload) => {
    let {user, record} = payload
    const {value} = record.approveStatus
    record.approver = (value === 'approved' || value === 'rejected') ? user.email : ''
    record.approveStatus = value
    try {
      const document = firestore.doc('note/' + record.id)
      await document.update({
        party: record.party,
        value: record.value,
        approver: record.approver,
        approveStatus: record.approveStatus
      })
    } catch (e) { return 'Update Error' }
    return 'Update OK'
  }
}
