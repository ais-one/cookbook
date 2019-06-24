<template>
  <div id="not-needed">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x ref="book-table" :parentId="null" v-bind="bookDefs" @form-open="openBookForm">
          <template v-slot:filter="{ filters, parentId, vcx }">
            <h1>Custom Filter Slot</h1>
            <p>Records: {{ vcx.records.length }}</p>
            <template v-for="(filter, i) in filters">
              <v-flex :key="i" v-bind="filter['field-wrapper']">
                <component :is="filter.type" v-model="filter.value" v-bind="filter['field-input']" />
              </v-flex>
            </template>
          </template>
          <!-- <template v-slot:table="{ records, totalRecords, pagination }">
            <div v-for="record in records" :key="record.id"><p>{{ record.id }} {{ record.name }} <v-btn @click="$refs['book-table'].crudFormOpen(record.id)">Open</v-btn></p></div>
            <div>{{ totalRecs }} {{ pagination }}</div>
          </template> -->
          <template v-slot:form="{ form, parentId }">
            <div>
              <h1>Custom Form Slot - Has Parent: {{ !!parentId }}</h1>
              <v-card-text>
                <v-text-field label="Book Name" v-model="form.name.value"></v-text-field>
                <v-select label="Category" v-model="form.categoryId.value" :items="categories" required item-text="name" item-value="id"></v-select>
                <v-autocomplete
                  multiple
                  v-model="authorIds"
                  :items="items"
                  :loading="isLoading"
                  :search-input.sync="search"
                  chips
                  clearable
                  hide-selected
                  item-text="name"
                  item-value="id"
                  label="Search for a author... (Maximum 2)"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>
                        No author yet...
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item, selected }">
                    <v-chip :input-value="selected" click:close @input="remove(item)">
                      <span v-text="item.name"></span>
                    </v-chip>
                  </template>
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-autocomplete>
                <v-btn @click.stop.prevent="gotoPages(form.id.value)" dark>View Book Pages</v-btn>
              </v-card-text>
            </div>
          </template>
        </vue-crud-x>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { from } from 'rxjs'
import { pluck, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators' // map
import { http } from '@/axios'

export default {
  subscriptions () {
    return {
      items: this.$watchAsObservable('search').pipe(
        // startWith - not needed in VueJS
        pluck('newValue'),
        filter(text => text ? text.length > 2 : false),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(this.fetchTerm)
        // map(this.formatResult)
      )
    }
  },
  name: 'book',
  data () {
    return {
      // auto-complete
      isLoading: false,
      authorIds: [], // use record
      search: '',

      categories: [
        { id: 1, name: 'cat1' },
        { id: 2, name: 'cat2' }
      ],
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
            { text: 'Category', value: 'categoryName', class: 'pa-1' }
          ],
          formatters: (value, _type) => value,
          doPage: 2,
          showFilterButton: true
        },
        filters: {
          'name': {
            type: 'v-text-field', // component name
            value: '',
            'field-wrapper': {
              xs12: true, sm6: true
            },
            'field-input': {
              label: 'Book Name', clearable: true
            }
          },
          'categoryId': {
            type: 'v-select', // component name
            value: { text: 'All', value: 0 },
            'field-wrapper': {
              xs12: true, sm6: true
            },
            'field-input': {
              label: 'Category',
              multiple: false,
              'return-object': true,
              items: [
                { text: 'All', value: 0 }, { text: 'cat1', value: 1 }, { text: 'cat2', value: 2 }
              ],
              rules: [v => !!v || 'Item is required']
            }
          }
        },
        form: {
          'id': { value: '' },
          'name': { value: '' },
          'categoryId': { value: '' },
          'authorIds': { value: [] },
          'authors': { value: [] }
        },
        // crudForm: {
        //   defaultRec: () => ({
        //     categoryId: '',
        //     categoryName: '',
        //     authorIds: [],
        //     authors: []
        //   })
        // },

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
              if (key === 'categoryId') value = filters[key].value.value
              if (value) params[key] = value
            }
            try {
              const { data: { results, total } } = await http.get('/api/books', { params })
              // console.log('find books', results)
              records = results
              totalRecords = total
            } catch (e) {
              console.log(e)
            }
            return { records, totalRecords }
          },
          findOne: async ({ id }) => {
            try {
              const { data } = await http.get(`/api/books/${id}`)
              return data
            } catch (e) { }
            return { }
          },
          create: async (payload) => {
            try {
              let { record: { id, ...noIdData } } = payload
              const rv = await http.post('/api/authors', noIdData)
              console.log(rv)
            } catch (e) { return 500 }
            // return { // EXAMPLE return object with code property omitted
            //   ok: true,
            //   msg: 'OK'
            // }
            return 201
          },
          // TBD Set the linkages also
          update: async (payload) => {
            // console.log('update payload', payload)
            try {
              let { record: { id, name, categoryId, authorIds } } = payload // authorIds
              // check that you only save what is needed...
              // console.log('record', id, noIdData)
              const rv = await http.patch(`/api/books/${id}`, { name, categoryId, authorIds }) // TBD also update the author ids...?
              console.log('patch rv', rv)
              // if (!doc.exists) throw new Error(409)
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
  // watch: {
  //   search (val) {
  //     if (this.items.length > 0) return // Items have already been loaded
  //     this.isLoading = true
  //     fetch('https://api.coinmarketcap.com/v2/listings/') // Lazily load input items
  //       .then(res => res.json())
  //       .then(res => this.items = res.data)
  //       .catch(err => console.log(err))
  //       .finally(() => (this.isLoading = false))
  //   }
  // },
  watch: {
    authorIds (val) {
      if (!val) return
      if (val.length > 2) val.pop()
      if (this.$refs['book-table']) this.$refs['book-table'].form.authorIds.value = val
      // console.log('watch')
    }
  },
  methods: {
    gotoPages (id) { // go to pages table for selected book
      // console.log('gotoPages - BookId: ', id)
      this.$router.push({ path: `/books/${id}/pages` })
    },
    remove (item) {
      // console.log('remove', item)
      const index = this.authorIds.indexOf(item.id)
      if (index >= 0) this.authorIds.splice(index, 1)
      // console.log(this.authorIds, this.$refs['book-table'].record.authorIds)
    },
    openBookForm (item) {
      // console.log('openBookForm', item)
      this.authorIds = item.authorIds.value
      this.items = item.authors.value
    },
    fetchTerm (term) {
      return from(
        http.get('/api/authors', { params: { page: 0, limit: 20, search: term } }).then(res => {
          // this.items = res.data
          return res.data.results
        })
        // fetch('https://api.coinmarketcap.com/v2/listings/')
        //   .then(res => res.json())
        //   .then(res => {
        //     // this.items = res.data
        //     return res.data
        //   })
        //   .finally(() => (this.isLoading = false))
      )
    }
    // formatResult (res) {
    //   return { term: res[0], matches: res[1].map((title, i) => ({ title, description: res[2][i], url: res[3][i] })) }
    // }
  }
}
</script>
