<template>
  <div id="not-needed">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x
          ref="book-pages-table"
          storeName="book-pages-table"
          :parentId="parentId"
          v-bind="pageDefs"
        >
          <template slot="filter" slot-scope="{ filterData, parentId, storeName }">
            <div>{{ filterData }}</div>
            <hr/>
            <div>{{ !!parentId }} {{ storeName }}</div>
          </template>
          <!-- <template slot="table" slot-scope="{ records, totalRecs, pagination }">
            <div v-for="record in records" :key="record.id"><p>{{ record.id }} {{ record.name }} <v-btn @click="$refs['my-table'].crudFormOpen(record.id)">Open</v-btn></p></div>
            <div>{{ totalRecs }} {{ pagination }}</div>
          </template> -->
          <template slot="form" slot-scope="{ record, parentId, storeName }">
            <div>
              <div>{{ record }} {{ !!parentId }} {{ storeName }}</div>
              <h1>Pages Form</h1>
              <v-card-text>
                <v-text-field label="Content" v-model="record.content"></v-text-field>
              </v-card-text>
            </div>
          </template>
        </vue-crud-x>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import { firestore } from '@/firebase'
// import { makeCsvRow, exportCsv } from '@/assets/util'
// import { format, startOfMonth, endOfMonth } from 'date-fns'
// import ComponentLoading from '@/components/ComponentLoading'
import { http } from '@/axios'
import VueCrudX from '@/VueCrudX'

export default {
  name: 'book-pages',
  components: {
    VueCrudX
  },
  data () {
    return {
      parentId: null,
      pageDefs: {
        crudTable: {
          name: 'book-pages',
          headers: [
            { text: 'Page Content', value: 'content', align: 'left', sortable: false }
          ],
          formatters: (value, _type) => { return value },
          // doPage: false,
          showGoBack: true //  do not show go back
        },
        crudFilter: { FilterVue: null, filterData: { } },
        crudForm: {
          FormVue: () => {},
          formAutoData: null,
          defaultRec: {
            id: null,
            content: null,
            bookId: null
          }
        },
        crudOps: { // CRUD
          export: null,
          find: async (payload) => {
            let records = []
            const { pagination, parentId } = payload // filterData // pagination: { sortBy, descending }
            const { page, rowsPerPage } = pagination
            try {
              const { data: { results, total } } = await http.get(`/api/books/${parentId}/pages`, {
                params: {
                  page: page > 0 ? page - 1 : 0,
                  limit: rowsPerPage
                }
              })
              console.log(results)
              results.forEach(row => {
                records.push(row)
              })
              pagination.totalItems = total
            } catch (e) {
              console.log(e)
            }
            console.log('pages', records)
            return { records, pagination }
          },
          findOne: async (payload) => {
            // const { id } = payload
            let record = { }
            // try {
            //   const doc = await firestore.collection('note').doc(id).get()
            //   if (doc.exists) {
            //     record = doc.data()
            //     record.id = id
            //     record.approveStatus = { text: record.approveStatus, value: record.approveStatus }
            //   }
            // } catch (e) { }
            return record
          },
          create: async (payload) => {
            try {
              let { record: { content }, parentId } = payload
              const rv = await http.post(`/api/books/${parentId}/pages`, { content })
              console.log('add page', rv)
            } catch (e) { return 500 }
            return 201
          },
          update: async (payload) => {
            try {
              let { record: { id, content } } = payload
              const rv = await http.patch(`/pages/${id}`, { content })
              console.log('update page', rv)
            } catch (e) { return 500 }
            return 200
          },
          delete: async (payload) => {
            try {
              let { record: { id } } = payload
              const rv = await http.delete(`/pages/${id}`)
              console.log('delete page', rv)
            } catch (e) { return 500 }
            return 200
          }
        }
      }
    }
  },
  mounted () {
    this.parentId = this.$route.params.id
    console.log(this.parentId)
  }
}

</script>
