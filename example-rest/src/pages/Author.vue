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
        infinite: true,
        vtable: {
          headers: [
            { text: 'Author Name', value: 'name', class: 'pa-1', render: (value) => value, edit: null }
          ]
        },
        pageDefaults: {
          start: 1
        },
        sortDefaults: {
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
          },
          'avatar': {
            type: 'app-file-upload',
            value: { savedUrl: 'aa', imageName: '', imageUrl: '', imageFile: '' },
            default: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': {
              label: 'Avatar'
            }
          }
        },
        crud: {
          find: async (payload) => {
            let records = []
            let totalRecords = 0
            const { pagination, filters = {}, sorters = {} } = payload // sorters = {} not used as it is in pagination for vuetify

            console.log(pagination, filters, sorters)
            const { page, itemsPerPage } = pagination
            let params = { page: page > 0 ? page - 1 : 0, limit: itemsPerPage, ...filters, sort: sorters } // set query params

            try {
              const { data: { results, total } } = await http.get('/api/authors', { params })
              records = results
              totalRecords = total
              // simulate infinite scroll
              const totalPages = Math.ceil(total / params.limit)
              let cursor = 0
              if (page < totalPages) cursor = page + 1
              else cursor = 0
              return { status: 200, data: { records, totalRecords, cursor } }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          findOne: async (id) => {
            try {
              const { data } = await http.get(`/api/authors/${id}`)
              data.avatar = { savedUrl: data.avatar, imageName: '', imageUrl: '', imageFile: '' }
              console.log('data', data)
              return { status: 200, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          create: async ({ record }) => {
            try {
              let { id, ...noIdData } = record
              const { data } = await http.post('/api/authors', noIdData)
              return { status: 201, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          update: async ({ record }) => {
            try {
              const { id, name, avatar } = record
              console.log('vvv', record)

              const json = JSON.stringify({ name })
              // const blob = new Blob([json], { type: 'application/json' })
              // console.log('json', blob)
              const formData = new FormData()
              formData.append('filex', avatar.imageFile) // const { name, size, type } = avatar.imageFile
              formData.append('docx', json)
              const { data } = await http.patch(`/api/authors/${id}`, formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                }
              )
              // const { data } = await http.patch(`/api/authors/${id}`, noIdData)
              // if (!doc.exists) throw new Error(409)
              // if (await hasDuplicate('party', 'name', noIdData['name'], id)) throw new Error(409)
              // await t.set(docRef, noIdData)
              return { status: 200, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }

            // axios({
            //   method: 'post',
            //   url: '/sample',
            //   data: data,
            // })
            // let formData = new FormData();
            // formData.append('file', this.file);
            // http.post( '/single-file',
            //   formData,
            //   {
            //     headers: {
            //       'Content-Type': 'multipart/form-data'
            //     }
            //   }
            // )

            // try {
            //   let { id, ...noIdData } = record
            //   const { data } = await http.patch(`/api/authors/${id}`, noIdData)
            //   // if (!doc.exists) throw new Error(409)
            //   // if (await hasDuplicate('party', 'name', noIdData['name'], id)) throw new Error(409)
            //   // await t.set(docRef, noIdData)
            //   return { status: 200, data }
            // } catch (e) {
            //   return { status: e.response.status, error: e.toString() }
            // }
          },
          'delete': async (id) => {
            try {
              const { data } = await http.delete(`/api/authors/${id}`)
              return { status: 200, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          } // done
        }
      }
    }
  }
}
</script>
