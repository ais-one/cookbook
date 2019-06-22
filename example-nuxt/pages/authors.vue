<template>
  <vue-crud-x ref="authors" :parentId="null" v-bind="authorDefs"></vue-crud-x>
</template>

<script>
import VueCrudX from '../../src/VueCrudX'

export default {
  middleware: ['auth'],
  name: 'authors',
  components: {
    VueCrudX
  },
  data() {
    return {
      authorDefs: {
        crudTable: {
          actionColumn: false,
          addrowCreate: false,
          // inline: false,
          confirmCreate: true,
          confirmUpdate: true,
          confirmDelete: true,
          headers: [{ text: 'Author Name', value: 'name', class: 'pa-1' }],
          formatters: (value, _type) => value,
          doPage: 2
        },
        filters: [
          {
            type: 'v-text-field', // component name
            name: 'name', // field name
            value: '',
            'field-wrapper': {
              xs12: true, sm6: true
            },
            'field-input': {
              label: 'Author', clearable: true
            }
          }
        ],
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
            name: ''
          })
        },
        crudOps: {
          export: async payload => {},
          find: async payload => {
            let records = []
            let totalRecords = 0
            const { pagination } = payload // filters
            const { page, itemsPerPage } = pagination // sortBy, descending
            try {
              const {
                data: { results, total }
              } = await this.$axios.get('/api/authors', {
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
          findOne: async payload => {
            const { id } = payload
            try {
              const { data } = await this.$axios.get(`/api/authors/${id}`)
              return data
            } catch (e) {}
            return {}
          },
          create: async payload => {
            try {
              let {
                record: { id, ...noIdData }
              } = payload
              const rv = await this.$axios.post('/api/authors', noIdData)
              console.log(rv)
            } catch (e) {
              return 500
            }
            return 201
          },
          update: async payload => {
            try {
              let {
                record: { id, ...noIdData }
              } = payload
              const rv = await this.$axios.patch(`/api/authors/${id}`, noIdData)
              console.log(rv)
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
  methods: {}
}
</script>
