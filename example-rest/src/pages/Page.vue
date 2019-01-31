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
// import { makeCsvRow, exportCsv } from '@/assets/util'
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
          saveRow: '#ffaaaa', // add save row button & specify color when row is changed, used with inline edit only and action column
          inlineReload: { // default true, set to false and use snapshot for large firestore dataset (or similar mechanisms where reads are chargeable)
            update: true,
            create: true,
            delete: true
          },
          addrowCreate: [
            {
              field: 'content',
              label: 'Content'
            }
          ], // add button creates new record by adding row, you can specified fields that use needs to pre-enter data,
          inline: { // editable fields on the table and what type of edit are they
            // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
            'content': {
              field: 'v-text-field', // v-text-field (blur will update contents if it was changed)
              attrs: {
                type: 'text', // number, email, password
                class: ['caption']
              }
            }
          },
          onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
          onRowClickOpenForm: false, // set to false of you do not want row click to open form

          // name: 'book-pages',
          headers: [
            { text: 'Action', value: '', fixed: true, sortable: false, class: 'pa-1' },
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
            content: '',
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
            console.log('find pages of a book', records)
            return { records, pagination }
          },
          findOne: (payload) => {},
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
              const rv = await http.patch(`/api/pages/${id}`, { content })
              console.log('update page', rv)
            } catch (e) { return 500 }
            return 200
          },
          'delete': async (payload) => {
            console.log('deleting page', payload)
            try {
              let { id } = payload
              const rv = await http.delete(`/api/pages/${id}`)
              console.log('delete page', rv)
            } catch (e) {
              console.log(e)
              return 500
            }
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
