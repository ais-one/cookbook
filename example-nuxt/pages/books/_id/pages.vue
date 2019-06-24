<template>
  <div id="not-needed">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x ref="book-pages-table" :parentId="parentId" v-bind="pageDefs">
          <template v-slot:filter="{ filters, parentId }">
            <div>{{ filters }}</div>
            <hr />
            <div>{{ !!parentId }}</div>
          </template>
          <!-- <template v-slot:table="{ records, totalRecs, pagination }">
            <div v-for="record in records" :key="record.id"><p>{{ record.id }} {{ record.name }} <v-btn @click="$refs['my-table'].crudFormOpen(record.id)">Open</v-btn></p></div>
            <div>{{ totalRecs }} {{ pagination }}</div>
          </template> -->
          <template v-slot:form="{ record, parentId }">
            <div>
              <div>{{ record }} {{ !!parentId }}</div>
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
import VueCrudX from '../../../../src/VueCrudX'

// import { makeCsvRow, exportCsv } from '@/assets/util'
export default {
  middleware: ['auth'],
  components: {
    VueCrudX
  },
  name: 'book-pages',
  data() {
    return {
      parentId: null,
      pageDefs: {
        crudTable: {
          // add save row button & specify color when row is changed, used with inline edit only and action column
          saveRow: '#ffaaaa',
          // default true, set to false and use snapshot for large firestore dataset (or similar mechanisms where reads are chargeable)
          inlineReload: {
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
          // editable fields on the table and what type of edit are they
          inline: {
            // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
            content: {
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
            {
              text: 'Action',
              value: '',
              fixed: true,
              sortable: false,
              class: 'pa-1'
            },
            {
              text: 'Page Content',
              value: 'content',
              align: 'left',
              sortable: false
            }
          ],
          formatters: (value, _type) => {
            return value
          },
          // doPage: false,
          showGoBack: true //  do not show go back
        },
        filters: null,
        crudForm: {
          formAutoData: null,
          defaultRec: {
            id: null,
            content: '',
            bookId: null
          }
        },
        // CRUD
        crudOps: {
          export: null,
          find: async payload => {
            let records = []
            let totalRecords = 0
            const { pagination, parentId } = payload // filters
            const { page, itemsPerPage } = pagination // sortBy, descending
            try {
              const {
                data: { results, total }
              } = await this.$axios.get(`/api/books/${parentId}/pages`, {
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
            return { records, pagination, totalRecords }
          },
          findOne: payload => {},
          create: async payload => {
            try {
              let {
                record: { content },
                parentId
              } = payload
              const rv = await this.$axios.post(`/api/books/${parentId}/pages`, {
                content
              })
              console.log('add page', rv)
            } catch (e) {
              return 500
            }
            return 201
          },
          update: async payload => {
            try {
              let {
                record: { id, content }
              } = payload
              const rv = await this.$axios.patch(`/api/pages/${id}`, {
                content
              })
              console.log('update page', rv)
            } catch (e) {
              return 500
            }
            return 200
          },
          delete: async payload => {
            console.log('deleting page', payload)
            try {
              let { id } = payload
              const rv = await this.$axios.delete(`/api/pages/${id}`)
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
  mounted() {
    this.parentId = this.$route.params.id
    console.log(this.parentId)
  }
}
</script>
