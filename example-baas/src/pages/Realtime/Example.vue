<template>
  <div id="abc">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x
          ref="taskRef"
          :parentId="null"
          v-bind="taskDefs"
          @selected="onSelected"
          @loaded="onLoaded"
        >
        </vue-crud-x>
      </v-flex>
    </v-layout>
    <v-btn v-if="newUpdatedCount" color="red" fab absolute  bottom right dark @click="resetIncomingAlert">{{newUpdatedCount}}</v-btn>
    <v-btn v-if="offsetTop" fab fixed dark bottom right @click.stop="scrollToTop"><v-icon>arrow_upward</v-icon></v-btn>
  </div>
</template>

<script>
import { orderBy } from 'lodash'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { firestore } from '@/firebase'
import VueCrudX from '../../../../src/VueCrudX' // Component shared between projects // const VueCrudX = Vue.component('vue-crud-x') this does not work...

// import * as taskDefs from './task'

const COL_NAME = 'task'
const area = ['North', 'South', 'East', 'West', 'Central']

export default {
  name: 'realtime-example',
  components: {
    VueCrudX
  },
  data () {
    return {
      taskDefs: {
        crudTable: {
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
        },
        filters: {
          area: { type: 'v-autocomplete', halfSize: true, value: '', attrs: { label: 'Area', class: 'pa-2', items: area, clearable: true } },
          readMode: { type: 'v-select', halfSize: true, value: 'Latest', attrs: { label: 'Latest 50 Or Date Range', class: 'pa-2', multiple: false, items: [ 'Latest', 'Date Range' ], rules: [v => !!v || 'Item is required'] } },
          dateStart: { type: 'app-date-picker', halfSize: true, value: format(startOfMonth(new Date()), 'YYYY-MM-DD'), attrs: { label: 'Date Start' } },
          timeStart: { type: 'app-time-picker', halfSize: true, value: '00:00', attrs: { label: 'Time Start' } },
          dateEnd: { type: 'app-date-picker', halfSize: true, value: format(endOfMonth(new Date()), 'YYYY-MM-DD'), attrs: { label: 'Date End' } },
          timeEnd: { type: 'app-time-picker', halfSize: true, value: '23:55', attrs: { label: 'Time End' } }
        },
        crudForm: {
          FormVue: null,
          defaultRec: () => ({
            id: '',
            area: 'CENTRAL',
            task: '',
            orderDatetime: '',
            orderDate: format(new Date(), 'YYYY-MM-DD'),
            orderTime: format(new Date(), 'HH:mm')
          })
        },
        crudOps: { // CRUD
          'export': null,
          'delete': null,
          find: async (payload) => {
            let records = []
            const { pagination } = payload
            try {
              const { area, readMode, dateStart, timeStart, dateEnd, timeEnd } = payload.filters
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
        this.subTime = format(new Date(), 'YYYY-MM-DD HH:mm:ss')
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
      const recs = this.$store.getters[this.colName + '/records']
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
      // recs.forEach(aa => console.log(aa.orderDatetime))
      const temp = orderBy(recs, ['orderDatetime'], ['desc']) // Use Lodash to sort array by 'name'
      if (temp.length > 50) { // if > limit page limit remove last record in array
        temp.splice(-1, 1) // or pop
      }
      this.$store.commit(this.colName + '/setRecords', { records: temp, totalRecs: temp.length })
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
