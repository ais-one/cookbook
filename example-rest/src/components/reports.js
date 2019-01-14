// import { makeCsvRow, exportCsv } from '@/assets/util'
import { format, subDays } from 'date-fns'
import { http } from '@/axios'

export const crudTable = {
  actionColumn: false, // action buttons (edit/delete)on the left most table column
  addrowCreate: false,
  saveRow: false, // add save row button , used with inline edit only and action column
  inline: false,
  inlineButtons: false,
  confirmCreate: false, // show operation confirmation dialog flags
  confirmUpdate: false,
  confirmDelete: false,
  headers: [
    { text: 'Created At', value: 'createdAt', fixed: true },
    { text: 'Pair', value: 'pair' },
    { text: 'Order Type', value: 'order_type' },
    { text: 'Price', value: 'price' },
    { text: 'Deal Price', value: 'deal_price' },
    { text: 'Timestamp', value: 'ts' }
  ],
  formatters: (value, _type) => {
    return value
  },
  crudTitle: 'Report',

  onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
  onRowClickOpenForm: false, // set to false of you do not want row click to open form
  doPage: true, // pagination enabled
  fullscreenForm: false, // dialog form is not fullscreen
  isFluid: true, // fluid layout
  hideHeaders: false, // do not hide headers
  showGoBack: false, // do net show go back button on table
  dark: false, // setting theme and colors
  fab: false,
  noDataColor: 'grey',
  formToolbarColor: 'grey',
  filterHeaderColor: 'grey',
  attrs: {
    'v-data-table': {
      'rows-per-page-items': [20, 50, 100, 200]
    }
  }
}

export const crudFilter = {
  hasFilterVue: false,
  FilterVue: null, // () => ({ component: null }),
  filterData: {
    dateStart: {
      type: 'date',
      label: 'Date Start',
      value: format(subDays(new Date(), 20), 'YYYY-MM-DD'),
      rules: [
        (v) => (v <= crudFilter.filterData.dateEnd.value) || 'Start date must be earlier or same as end date'
      ],
      halfSize: true
    },
    dateEnd: {
      type: 'date',
      label: 'Date Start',
      value: format(new Date(), 'YYYY-MM-DD'),
      rules: [
        (v) => (v >= crudFilter.filterData.dateStart.value) || 'End date must be later or same as start date'
      ],
      halfSize: true
    },
    orderSide: {
      type: 'v-select',
      value: 'all',
      halfSize: true,
      attrs: {
        label: 'Order Side',
        multiple: false,
        items: [ 'all', 'buy', 'sell' ],
        rules: [v => !!v || 'Item is required']
      }
    },
    caller: {
      type: 'v-select',
      value: 'all',
      halfSize: true,
      attrs: {
        label: 'Caller',
        multiple: false,
        items: [ 'all', 'moduleExecution' ],
        rules: [v => !!v || 'Item is required']
      }
    },
    status: {
      type: 'v-select',
      value: 'all',
      halfSize: true,
      attrs: {
        label: 'Status',
        multiple: false,
        items: [ 'all', 'tbd' ],
        rules: [v => !!v || 'Item is required']
      }
    }

  }
}

export const crudForm = {
  FormVue: null,
  formAutoData: false,
  defaultRec: () => ({
    id: ''
  })
}

export const crudOps = { // CRUD
  export: null,
  // async (payload) => {
  //   const { filterData } = payload // pagination
  //   try {
  //     let dbCol = firestore.collection('party') // create index
  //       .where('status', '==', filterData.active.value)
  //     const rv = await dbCol.limit(50).get()
  //     let csvContent = ''
  //     rv.forEach(record => {
  //       let tmp = record.data()
  //       csvContent += makeCsvRow(csvContent, tmp, `\r\n`, ';')
  //     })
  //     // rv.reduce((accumulator, currentValue) => accumulator + currentValue, '')
  //     exportCsv(csvContent, 'party.csv')
  //   } catch (e) { }
  // },
  find: async (payload) => {
    let records = []
    const { pagination, filterData } = payload
    const { rowsPerPage, page } = pagination // , totalItems, sortBy, descending
    try {
      const opts = {
        headers: { token: payload.user.token },
        params: {
          start: filterData.dateStart.value,
          end: filterData.dateEnd.value,
          page: page,
          pageSize: rowsPerPage,
          orderSide: filterData.orderSide.value,
          status: filterData.status.value,
          caller: filterData.caller.value
        }
      }
      const rv = await http.get('/report', opts)
      let index = 0
      rv.data.results.forEach(item => {
        records.push({ id: index, ...item })
      })
      pagination.totalItems = rv.data.total
    } catch (e) { console.log(e) }
    return { records, pagination }
  },
  findOne: async (payload) => { return { } },
  create: null,
  update: null,
  delete: null
}
