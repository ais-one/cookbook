<template>
  <div id="not-needed">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x
          ref="book-pages-table"
          :parentId="parentId"
          v-bind="pageDefs"
        >
          <template v-slot:filter="{ filters, parentId }">
            <div>{{ filters }}</div>
            <hr/>
            <div>{{ !!parentId }}</div>
          </template>
          <!-- <template v-slot:table="{ records, totalRecs, pagination }">
            <div v-for="record in records" :key="record.id"><p>{{ record.id }} {{ record.name }} <v-btn @click="$refs['my-table'].crudFormOpen(record.id)">Open</v-btn></p></div>
            <div>{{ totalRecs }} {{ pagination }}</div>
          </template> -->
          <!-- <template v-slot:form="{ form, parentId }">
            <div>
              <div>{{ form }} {{ !!parentId }}</div>
              <h1>Pages Form</h1>
              <v-card-text>
                <v-text-field label="Content" v-model="form.content.value"></v-text-field>
              </v-card-text>
            </div>
          </template> -->
        </vue-crud-x>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import { makeCsvRow, exportCsv } from '@/assets/util'
import { http } from '@/axios'

export default {
  name: 'book-pages',
  data () {
    return {
      parentId: null,
      pageDefs: {
        crudTable: {
          // saveRow: '#ffaaaa', // add save row button & specify color when row is changed, used with inline edit only and action column
          // inlineReload: { // default true, set to false and use snapshot for large firestore dataset (or similar mechanisms where reads are chargeable)
          //   update: true,
          //   create: true,
          //   delete: true
          // },
          // addrowCreate: [
          //   {
          //     field: 'content',
          //     label: 'Content'
          //   }
          // ], // add button creates new record by adding row, you can specified fields that use needs to pre-enter data,
          // inline: { // editable fields on the table and what type of edit are they
          //   // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
          //   'content': {
          //     field: 'v-text-field', // v-text-field (blur will update contents if it was changed)
          //     attrs: {
          //       type: 'text', // number, email, password
          //       class: ['caption']
          //     }
          //   }
          // },
          // onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
          // onRowClickOpenForm: false, // set to false of you do not want row click to open form

          // onCreatedOpenForm: true, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
          // onRowClickOpenForm: true, // set to false of you do not want row click to open form

          // name: 'book-pages',
          headers: [
            // { text: 'Action', value: '', fixed: true, sortable: false, class: 'pa-1' },
            {
              text: 'ID',
              value: 'id',
              align: 'left',
              sortable: false,
              action: {
                edit: true,
                delete: true
              }
            },
            {
              text: 'Page Content',
              value: 'content',
              align: 'left',
              sortable: false
            }
          ],
          // doPage: false,
          showGoBack: true //  do not show go back
        },
        filters: null,
        inline: {
          edit: true,
          add: true
        },
        // form: null,
        form: {
          'id': { value: '', hidden: 'all' },
          'content': { value: '', type: 'v-text-field' },
          'bookId': { value: '', hidden: 'all' }
        },
        crudOps: { // CRUD
          export: null,
          find: async (payload) => {
            let records = []
            let totalRecords = 0
            const { pagination, parentId } = payload // filters
            const { page, itemsPerPage } = pagination // sortBy, descending
            try {
              const { data: { results, total } } = await http.get(`/api/books/${parentId}/pages`, {
                params: {
                  page: page > 0 ? page - 1 : 0,
                  limit: itemsPerPage
                }
              })
              records = results
              totalRecords = total
            } catch (e) {
              console.log(e)
            }
            return { records, totalRecords }
          },
          findOne: async ({ id }) => {
            try {
              const { data } = await http.get(`/api/pages/${id}`)
              return data
            } catch (e) { }
            return { }
          },
          create: async (payload) => {
            try {
              let { record, parentId } = payload
              // let { record: { content }, parentId } = payload
              const rv = await http.post(`/api/books/${parentId}/pages`, record)
              console.log('add page', rv)
            } catch (e) { return 500 }
            return 201
          },
          update: async (payload) => {
            try {
              let { id, record: { content } } = payload
              const rv = await http.patch(`/api/pages/${id}`, { content })
              console.log('update page', rv)
            } catch (e) { return 500 }
            return 200
          },
          'delete': async ({ id }) => {
            try {
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
    // this.pageDefs.crudTable.form = null // uncomment to test without forms
    this.pageDefs.inline.add = false // comment to test without forms
    this.parentId = this.$route.params.id
  }
}

</script>
