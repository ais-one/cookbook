<template>
  <div id="not-needed">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x
          ref="book-table"
          storeName="book-table"
          :parentId="null"
          v-bind="bookDefs"
        >
          <template slot="filter" slot-scope="{ filterData, parentId, storeName }">
            <div>{{ filterData }}</div>
            <hr/>
            <div>{{ !!parentId }} {{ storeName }}</div>
          </template>
          <!-- <template v-if="showCustomTable" slot="table" slot-scope="{ records, totalRecs, pagination }">
            <div v-for="record in records" :key="record.id"><p>{{ record.id }} {{ record.name }} <v-btn @click="$refs['my-table'].crudFormOpen(record.id)">Open</v-btn></p></div>
            <div>{{ totalRecs }} {{ pagination }}</div>
          </template> -->
          <template slot="form" slot-scope="{ record, parentId, storeName }">
            <div>{{ record }}</div>
            <hr/>
            <div>{{ !!parentId }} {{ storeName }}</div>
          </template>
        </vue-crud-x>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { http } from '@/axios'

// import * as partyDefs from './party'
import VueCrudX from '@/VueCrudX'

export default {
  name: 'book',
  components: {
    VueCrudX
  },
  data () {
    return {
      bookDefs: {
        crudTable: {
          actionColumn: false,
          addrowCreate: false,
          // inline: false,
          confirmCreate: true,
          confirmUpdate: true,
          confirmDelete: true,
          headers: [
            { text: 'Book Name', value: 'name', class: 'pa-1' },
            { text: 'Category', value: 'category', class: 'pa-1' }
          ],
          formatters: (value, _type) => value,
          doPage: true
        },

        crudFilter: { hasFilterVue: false, FilterVue: null, filterData: { } },

        crudForm: {
          FormVue: null,
          formAutoData: {
            id: { type: 'input', attrs: { hidden: true } }, // need id if there is delete
            name: {
              type: 'v-text-field',
              attrs: {
                label: 'Name',
                rules: [v => !!v || 'Item is required']
              },
              halfSize: false
            }
          },
          defaultRec: () => ({
            id: '',
            name: '',
            categoryId: ''
          })
        },

        crudOps: { // CRUD
          export: async (payload) => {
          },
          find: async (payload) => {
            let records = []
            const { pagination } = payload // filterData // pagination: { sortBy, descending }
            const { page, rowsPerPage } = pagination
            try {
              const { data: { results, total } } = await http.get('/api/books', {
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
            return { records, pagination }
          },
          findOne: async (payload) => {
            const { id } = payload
            try {
              const { data } = await http.get(`/api/authors/${id}`)
              return data
            } catch (e) { }
            return { }
          },
          create: async (payload) => {
            try {
              let { record: { id, ...noIdData } } = payload
              const rv = await http.post('/api/authors', noIdData)
              console.log(rv)
            } catch (e) {
              return 500
            }
            // return { // EXAMPLE return object with code property omitted
            //   ok: true,
            //   msg: 'OK'
            // }
            return 201
          },
          update: async (payload) => {
            console.log(payload)
            try {
              let { record: { id, ...noIdData } } = payload
              const rv = await http.patch(`/api/authors/${id}`, noIdData)
              console.log(rv)
              // if (!doc.exists) throw new Error(409)
              // if (await hasDuplicate('party', 'name', noIdData['name'], id)) throw new Error(409)
              // await t.set(docRef, noIdData)
            } catch (e) {
              if (parseInt(e.message) === 409) return 409
              else return 500
            }
            return 200
          },
          delete: null // TBD if delete, must also delete all dependancies, move all buttons to right?
        }
      }
    }
  },
  methods: {
  }
}
</script>
