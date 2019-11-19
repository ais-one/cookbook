<template>
  <div id="abc">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x ref="taskRef" :parentId="null" v-bind="taskDefs" @selected="onSelected" @loaded="onLoaded" />
      </v-flex>
    </v-layout>
    <v-btn v-if="newUpdatedCount" color="red" fab absolute  bottom right dark @click="resetIncomingAlert">{{newUpdatedCount}}</v-btn>
    <v-btn v-if="offsetTop" fab fixed dark bottom right @click.stop="scrollToTop"><v-icon>arrow_upward</v-icon></v-btn>
  </div>
</template>

<script>
/*
1. Firebase CRUD
2. Real-time updates
  - override default behaviour for post create, update and delete operations
  - apply sorting
  - get notification
3. Inline edit - text, select, date input
*/
import _orderBy from 'lodash.orderby'
import { format } from 'date-fns' // startOfMonth, endOfMonth, later
import { firestore } from '@/firebase'

import * as locationJson from './LOCATION_REF_JSON.json'
const locations = locationJson.default.map(item => item.locationCode)

const COL_NAME = 'task'
const TASK_LIMIT = 10
// Add In later... const area = ['North', 'South', 'East', 'West', 'Central']

export default {
  name: 'firebase-rt',
  data () {
    return {
      parentId: null,
      taskDefs: {
        // overide set all to do nothing, as firebase will take care of post crud actions
        updated: ({ data }) => { },
        created: ({ data }) => { },
        deleted: (id) => { },

        infinite: true,
        inline: { // comment this if you want to use form instead of inline updates...
          create: false, update: true, delete: false
        },
        title: 'Task',
        pageDefaults: { // page options
          // VARIATION - Start Vuetify2
          start: 1,
          itemsPerPage: 50,
          sortBy: [],
          sortDesc: []
          // VARIATION - End Vuetify2
        },
        vtable: {
          headers: [
            { text: 'ID', value: 'id', align: 'left', sortable: false, class: 'py-1 px-2', action: true },
            {
              text: 'Assigned', value: 'assign', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-select', props: { multiple: false, items: [ 'APEX 1', 'APEX 2' ] } }
            },
            { text: 'Vessel Name', value: 'vessel', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-text-field', required: true } },
            {
              text: 'Location', value: 'location', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-combobox', props: { multiple: false, items: locations } }
            },
            {
              text: 'Job Type', value: 'jobType', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-select', props: { multiple: false, items: [ 'TO SHIP', 'FROM SHIP', 'RETURN' ] } }
            },
            {
              text: 'Base', value: 'base', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-select', props: { multiple: false, items: [ 'WCP', 'MSP' ] } }
            },
            {
              text: 'Date', value: 'orderDate', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'app-date-picker' }
            },
            {
              text: 'Time', value: 'orderTime', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'app-time-picker' }
            },
            {
              text: 'Standby (Hr)', value: 'standByHr', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-select', props: { multiple: false, items: [ '0', '1', '2' ] } }
            },
            { text: 'Contact', value: 'contact', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-text-field', required: true } },
            { text: 'Pax', value: 'pax', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-text-field' } },
            { text: 'Remarks', value: 'remarks', align: 'left', sortable: false, class: 'pa-1', edit: { type: 'v-text-field' } }
            // { text: 'Update By', value: 'updatedBy', align: 'left', sortable: false, class: 'pa-1' },
            // { text: 'Update At', value: 'updatedAt', align: 'left', sortable: false, class: 'pa-1' }
          ]
        },
        filters: null,
        // filters: {
        //   // area: { type: 'v-autocomplete', halfSize: true, value: '', attrs: { label: 'Area', class: 'pa-2', items: area, clearable: true } },
        //   // readMode: { type: 'v-select', halfSize: true, value: 'Latest', attrs: { label: 'Latest 10 Or Date Range', class: 'pa-2', multiple: false, items: [ 'Latest', 'Date Range' ], rules: [v => !!v || 'Item is required'] } },
        //   dateStart: { type: 'app-date-picker', halfSize: true, value: format(startOfMonth(new Date()), 'yyyy-MM-dd'), attrs: { label: 'Date Start' } },
        //   // timeStart: { type: 'app-time-picker', halfSize: true, value: '00:00', attrs: { label: 'Time Start' } },
        //   dateEnd: { type: 'app-date-picker', halfSize: true, value: format(endOfMonth(new Date()), 'yyyy-MM-dd'), attrs: { label: 'Date End' } }
        //   // timeEnd: { type: 'app-time-picker', halfSize: true, value: '23:55', attrs: { label: 'Time End' } }
        // },
        form: {
          'id': { value: '', default: '', hidden: 'all' },
          // 'area': { value: 'CENTRAL', default: 'CENTRAL', type: 'v-autocomplete' },
          'assign': { type: 'v-select', value: '---', default: '---', 'field-input': { placeholder: 'Assign Boat', multiple: false, items: [ '---', 'APEX 1', 'APEX 2' ] }, 'field-wrapper': { xs12: true } },
          'location': { type: 'v-combobox', value: '', default: '', 'field-input': { label: 'Location', multiple: false, items: locations }, 'field-wrapper': { xs12: true } },
          'jobType': { type: 'v-select', value: 'TO SHIP', default: 'TO SHIP', 'field-input': { placeholder: 'Job', multiple: false, items: [ 'TO SHIP', 'FROM SHIP', 'RETURN' ] }, 'field-wrapper': { xs12: true } },
          'base': { type: 'v-select', value: 'MSP', default: 'MSP', 'field-input': { placeholder: 'Base', multiple: false, items: [ 'WCP', 'MSP' ] }, 'field-wrapper': { xs12: true } },
          'vessel': { value: '', default: '', type: 'v-text-field', 'field-input': { placeholder: 'Vessel', required: true }, 'field-wrapper': { xs12: true } },
          'orderDate': { default: format(new Date(), 'yyyy-MM-dd'), value: format(new Date(), 'yyyy-MM-dd'), type: 'app-date-picker', 'field-wrapper': { xs12: true } },
          'orderTime': { default: format(new Date(), 'HH:mm'), value: format(new Date(), 'HH:mm'), type: 'app-time-picker', 'field-wrapper': { xs12: true } },
          'standByHr': { type: 'v-select', value: '0', default: '0', 'field-input': { placeholder: 'Standby (Hr)', multiple: false, items: [ '0', '1', '2' ] }, 'field-wrapper': { xs12: true } },
          'contact': { value: '', default: '', type: 'v-text-field', 'field-input': { placeholder: 'Contact', required: true }, 'field-wrapper': { xs12: true } },
          'pax': { value: '', default: '', type: 'v-text-field', 'field-input': { placeholder: 'Pax' }, 'field-wrapper': { xs12: true } },
          'remarks': { value: '', default: '', type: 'v-text-field', 'field-input': { placeholder: 'Remarks' }, 'field-wrapper': { xs12: true } }
        },
        crud: {
          find: async (payload) => {
            let records = []
            try {
              // const { area, readMode, dateStart, timeStart, dateEnd, timeEnd } = payload.filters
              let dbCol = firestore.collection(COL_NAME)
              // if (area.value) dbCol = dbCol.where('area', '==', area.value)
              // if (readMode.value === 'Latest') {
              dbCol = dbCol.orderBy('orderDatetime', 'desc').limit(TASK_LIMIT) // temporary limit for now
              // } else { // date range
              //   dbCol = dbCol.where('orderDatetime', '>=', dateStart.value + ' ' + timeStart.value)
              //     .where('orderDatetime', '<=', dateEnd.value + ' ' + timeEnd.value)
              //     .orderBy('orderDatetime', 'desc').limit(TASK_LIMIT)
              // }
              // const rv = await dbCol.get()
              const rv = await dbCol.get()
              rv.forEach(record => {
                records.push({ id: record.id, ...record.data() })
              })
              return { status: 200, data: { records, totalRecords: records.length, cursor: '' } }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          findOne: async (id) => {
            let record = { }
            try {
              const doc = await firestore.collection(COL_NAME).doc(id).get()
              if (doc.exists) {
                record = { id, ...doc.data() }
              }
              return { status: 200, data: record }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          create: async (payload) => {
            const { record: { id, ...noIdData } } = payload
            try {
              noIdData.updatedBy = '' // TBD user.email
              noIdData.updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
              noIdData.orderDatetime = noIdData.orderDate + ' ' + noIdData.orderTime
              await firestore.collection(COL_NAME).add(noIdData)
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
            return { status: 201, data: null }
          },
          update: async (payload) => {
            const { record: { id, ...noIdData } } = payload
            console.log('noIdData', noIdData)
            // noIdData.area = noIdData.area ? noIdData.area : ''
            noIdData.orderDatetime = noIdData.orderDate + ' ' + noIdData.orderTime
            noIdData.updatedBy = '' // TBD user.email
            noIdData.updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            try { await firestore.doc(COL_NAME + '/' + id).update(noIdData) } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
            return { status: 200, data: { id, ...noIdData } }
          }
        } // done
      },
      selectedId: null,
      offsetTop: 0,
      colName: COL_NAME,
      newUpdatedCount: 0,
      unsub: null,
      subTime: null
    }
  },
  created () {
  },
  mounted () {
    this.load()
  },
  beforeDestroy () {
    this.unload()
  },
  methods: {
    load () {
      // this.$refs.taskRef
      if (!this.subTime) {
        this.subTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        // console.log(this.subTime)
        this.unsub = firestore.collection(this.colName)
          .where('updatedAt', '>', this.subTime)
          .limit(8).onSnapshot((snapshot) => {
            // const localUpdate = snapshot.metadata.hasPendingWrites
            snapshot.docChanges().forEach(change => {
              if (change.type === 'added' || change.type === 'modified') {
                // console.log('change', change)
                this.setIncomingAlert(change.doc)
              }
              if (change.type === 'removed') {
              }
            })
          })
      }
    },
    unload () {
      if (this.subTime) {
        this.unsub()
        this.subTime = null
      }
    },
    resetIncomingAlert () {
      this.newUpdatedCount = 0
    },
    setIncomingAlert (doc) {
      console.log('setIncomingAlert', doc.data())
      const recs = this.$refs.taskRef.records // this.$store.state[this.colName + '/records']
      let exists = false
      for (let i in recs) { // update
        if (recs[i].id === doc.id) {
          const recUpdatedAt = recs[i].updatedAt
          const docUpdatedAt = doc.data().updatedAt
          if (docUpdatedAt > recUpdatedAt) {
            recs[i] = { id: doc.id, ...doc.data() }
          }
          exists = true
          break
        }
      }
      if (!exists) {
        recs.push({ id: doc.id, ...doc.data() }) // insert
      }
      // console.log('exists', exists, recs)
      // recs.forEach(aa => console.log(aa.orderDatetime))
      const temp = _orderBy(recs, ['orderDatetime'], ['desc']) // Use Lodash to sort array by 'name'
      if (temp.length > TASK_LIMIT) { // if > limit page limit remove last record in array
        temp.splice(-1, 1) // or pop
      }
      // this.$store.commit(this.colName + '/setRecords', { records: temp, totalRecs: temp.length })
      this.$refs.taskRef.records = temp
      this.$refs.taskRef.totalFecords = temp.length
      this.newUpdatedCount++
    },
    scrollToTop () {
      this.$nextTick(function () {
        this.$refs.pageTop.scrollIntoView()
      })
    },
    onScroll (e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
    },
    async onSelected (data) {
      // this.selectedId = data.item.name
      // console.log('onSelected')
    },
    onLoaded () { // to update the uploaded
      // console.log('load')
    }
  }
}
</script>
