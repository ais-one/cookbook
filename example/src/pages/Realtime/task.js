import { firestore } from '../../firebase'
import { startOfMonth, endOfMonth, format } from 'date-fns'

const COL_NAME = 'task'

const area = ['North', 'South', 'East', 'West', 'Central']

export const crudTable = {
  saveRow: '#ffaaaa',
  inline: {
    task: { field: 'v-text-field', attrs: { type: 'text', class: ['caption'] } },
    area: { field: 'v-autocomplete', attrs: { items: area, class: 'caption' } },
    orderDate: { field: 'v-date-picker', attrs: { } },
    orderTime: { field: 'v-time-picker', attrs: { } }
  },
  confirmCreate: false,
  confirmUpdate: false,
  confirmDelete: true,
  headers: [
    { text: 'Action', value: '', align: 'center', sortable: false, class: 'py-1 px-2' },
    { text: 'Task', value: 'task', align: 'left', sortable: false, class: 'pa-1' },
    { text: 'Area', value: 'area', align: 'left', sortable: false, class: 'pa-1' },
    { text: 'Date', value: 'orderDate', align: 'left', sortable: false, class: 'pa-1' },
    { text: 'Time', value: 'orderTime', align: 'left', sortable: false, class: 'pa-1' }
  ],
  formatters: (value, _type) => {
    return value
  },
  onRowClickOpenForm: false,
  fullscreenForm: true,
  addrowCreate: [ ],
  doPage: false,
  crudTitle: 'Task',
  inlineReload: { // default true, set to false and use snapshot for large firestore dataset (or similar mechanisms where reads are chargeable)
    update: false,
    create: false,
    delete: false
  }
}

export const crudFilter = {
  FilterVue: null,
  filterData: {
    area: { type: 'v-autocomplete', halfSize: true, value: '', attrs: { label: 'Area', class: 'pa-2', items: area, clearable: true } },
    readMode: { type: 'v-select', halfSize: true, value: 'Latest', attrs: { label: 'Latest 50 Or Date Range', class: 'pa-2', multiple: false, items: [ 'Latest', 'Date Range' ], rules: [v => !!v || 'Item is required'] } },
    dateStart: { type: 'app-date-picker', halfSize: true, value: format(startOfMonth(new Date()), 'YYYY-MM-DD'), attrs: { label: 'Date Start' } },
    timeStart: { type: 'app-time-picker', halfSize: true, value: '00:00', attrs: { label: 'Time Start' } },
    dateEnd: { type: 'app-date-picker', halfSize: true, value: format(endOfMonth(new Date()), 'YYYY-MM-DD'), attrs: { label: 'Date End' } },
    timeEnd: { type: 'app-time-picker', halfSize: true, value: '23:55', attrs: { label: 'Time End' } }
  }
}

export const crudForm = {
  FormVue: null,
  defaultRec: () => ({
    id: '',
    area: 'CENTRAL',
    task: '',
    orderDatetime: '',
    orderDate: format(new Date(), 'YYYY-MM-DD'),
    orderTime: format(new Date(), 'HH:mm')
  })
}

export const crudOps = { // CRUD
  'export': null,
  'delete': null,
  find: async (payload) => {
    let records = []
    const { pagination } = payload
    try {
      const { area, readMode, dateStart, timeStart, dateEnd, timeEnd } = payload.filterData
      let dbCol = firestore.collection(COL_NAME)
      if (area.value) dbCol = dbCol.where('area', '==', area.value)
      if (readMode.value === 'Latest') {
        dbCol = dbCol.orderBy('orderDatetime', 'desc').limit(50) // temporary limit for now
      } else { // date range
        dbCol = dbCol.where('orderDatetime', '>=', dateStart.value + ' ' + timeStart.value)
          .where('orderDatetime', '<=', dateEnd.value + ' ' + timeEnd.value)
          .orderBy('orderDatetime', 'desc').limit(50)
      }
      const rv = await dbCol.get()
      rv.forEach(record => {
        records.push({ id: record.id, ...record.data() })
      })
    } catch (e) { console.log(e) }
    return { records, pagination }
  },
  findOne: async (payload) => {
    const { id } = payload
    let record = { }
    try {
      const doc = await firestore.collection(COL_NAME).doc(id).get()
      if (doc.exists) {
        record = { id, ...doc.data() }
      }
    } catch (e) { }
    return record
  },
  create: async (payload) => {
    const { record: { id, ...noIdData }, user } = payload
    try {
      noIdData.updatedBy = user.email
      noIdData.updatedAt = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
      noIdData.orderDatetime = noIdData.orderDate + ' ' + noIdData.orderTime
      await firestore.collection(COL_NAME).add(noIdData)
    } catch (e) {
      console.log(e)
      return 500
    }
    return 201
  },
  update: async (payload) => {
    const { record: { id, ...noIdData }, user } = payload
    noIdData.area = noIdData.area ? noIdData.area : ''
    noIdData.orderDatetime = noIdData.orderDate + ' ' + noIdData.orderTime
    noIdData.updatedBy = user.email
    noIdData.updatedAt = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
    try { await firestore.doc(COL_NAME + '/' + id).update(noIdData) } catch (e) { return 500 }
    return 200
  }
}
