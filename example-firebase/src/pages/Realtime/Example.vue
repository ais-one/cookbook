<template>
  <div id="abc">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x
          ref="taskRef"
          :storeName="colName"
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
import { format } from 'date-fns'
import VueCrudX from '@/VueCrudX' // copy the source vue file here if you want to tinker with it
import { firestore } from '@/firebase'
import * as taskDefs from './task'

const COL_NAME = 'task'

export default {
  name: 'realtime-example',
  components: {
    VueCrudX
  },
  data () {
    return {
      taskDefs,
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
