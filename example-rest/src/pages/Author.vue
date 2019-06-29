<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x ref="author" :parentId="parentId" v-bind="authorDefs" />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { http } from '@/axios'

export default {
  name: 'author',
  data () {
    return {
      parentId: null,
      authorDefs: {
        crudTable: {
          actionColumn: false,
          addrowCreate: false,
          // inline: false,
          confirmCreate: true,
          confirmUpdate: true,
          confirmDelete: true,
          headers: [
            { text: 'Author Name', value: 'name', class: 'pa-1', render: (value) => value, edit: null }
          ],
          doPage: 2,
          showFilterButton: true
        },

        // v2
        pageOptions: {
          infinite: true,
          page: 1,
          limit: 2
        },
        filters: {
          'name': {
            type: 'v-text-field', // component name
            value: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'Author', clearable: true
            }
          }
        },
        form: {
          'id': {
            type: 'v-text-field',
            value: '',
            default: '',
            hidden: 'add', // add, edit, all, null
            readonly: 'all', // add, edit, all, null
            validation: null, // validation function no in place yet
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'ID'
            }
          },
          'name': {
            type: 'v-text-field',
            value: '',
            default: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'Name',
              rules: [v => !!v || 'Item is required']
            }
          }
        },
        crudOps: { // CRUD
          export: null,
          find: async (payload) => {
            let records = []
            let totalRecords = 0
            const { pagination, filters } = payload
            const { page, itemsPerPage } = pagination // sortBy, descending
            let params = { page: page > 0 ? page - 1 : 0, limit: itemsPerPage } // set query params
            for (let key in filters) {
              let value = filters[key].value
              if (value) params[key] = value
            }
            try {
              const { data: { results, total } } = await http.get('/api/authors', { params })
              records = results
              totalRecords = total
              // simulate infinite scroll
              const totalPages = Math.ceil(total / params.limit)
              if (page < totalPages) pagination.page += 1
              else pagination.page = 0
              // TOREMOVE if (page === 1) pagination.page = 2
              // TOREMOVE else if (page === 2) pagination.page = 0
              return { status: 200, data: { records, totalRecords, pagination } }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          findOne: async (payload) => {
            const { id } = payload
            try {
              const { data } = await http.get(`/api/authors/${id}`)
              return { status: 200, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          create: async (payload) => {
            try {
              let { record: { id, ...noIdData } } = payload
              const { data } = await http.post('/api/authors', noIdData)
              return { status: 201, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          update: async (payload) => {
            try {
              let { record: { id, ...noIdData } } = payload
              const { data } = await http.patch(`/api/authors/${id}`, noIdData)
              // if (!doc.exists) throw new Error(409)
              // if (await hasDuplicate('party', 'name', noIdData['name'], id)) throw new Error(409)
              // await t.set(docRef, noIdData)
              return { status: 200, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          delete: null
        }
      }
    }
  }
}
</script>
