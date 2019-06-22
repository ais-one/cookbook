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
            { text: 'Author Name', value: 'name', class: 'pa-1' }
          ],
          formatters: (value, _type) => value,
          doPage: 2,
          showFilterButton: true
        },
        filters: [
          {
            type: 'v-text-field', // component name
            name: 'name', // field name
            value: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'Author', clearable: true
            }
          }
        ],
        form: [
          {
            name: 'id',
            type: 'v-text-field',
            value: '',
            hidden: 'add', // add, edit, all, null
            readonly: 'all', // add, edit, all, null
            validation: null, // validation function no in place yet
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'ID'
            }
          },
          {
            name: 'name',
            type: 'v-text-field',
            value: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'Name',
              rules: [v => !!v || 'Item is required']
            }
          }
        ],
        crudOps: { // CRUD
          export: null,
          find: async (payload) => {
            let records = []
            let totalRecords = 0
            const { pagination } = payload
            const { page, itemsPerPage } = pagination // sortBy, descending
            try {
              const { data: { results, total } } = await http.get('/api/authors', {
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
  }
}
</script>
