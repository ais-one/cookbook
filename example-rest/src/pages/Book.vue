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
              <h1>Custom Form Slot - Has Parent: {{ !!parentId }} {{ form }}</h1>
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
                <v-btn v-if="form.id.value" @click.stop.prevent="gotoPages(form.id.value)" dark>View Book Pages</v-btn>
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
          // inline: false,
          confirmCreate: true,
          confirmUpdate: true,
          confirmDelete: true,
          headers: [
            { text: 'Book Name', value: 'name', class: 'pa-1' },
            { text: 'Rating', value: 'rating', class: 'pa-1' },
            { text: 'Year Published', value: 'yearPublished', class: 'pa-1' },
            { text: 'Category', value: 'categoryName', class: 'pa-1' }
          ],
          showFilterButton: true
        },
        table: {
          'multi-sort': true
        },
        filters: {
          'name': {
            type: 'v-text-field', // component name
            value: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': { label: 'Book Name', clearable: true }
          },
          'rating': {
            type: 'v-text-field', // component name
            value: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': { label: 'Rating', type: 'number', clearable: true }
          },
          'yearPublished': {
            type: 'v-text-field', // component name
            value: '',
            'field-wrapper': { xs12: true, sm6: true },
            'field-input': { label: 'Year Published', clearable: true }
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
          'id': { value: '', default: '' },
          'name': { value: '', default: '' },
          'categoryId': { value: '', default: '' },
          'authorIds': { value: [], default: [] },
          'authors': { value: [], default: [] }
        },

        crudOps: { // CRUD
          export: null,
          find: async ({ pagination, filters = {}, sorters = {} }) => {
            let records = []
            let totalRecords = 0
            const { page, itemsPerPage } = pagination // sortBy, descending
            // console.log(pagination, filters)
            if (filters['categoryId']) {
              if (filters['categoryId'].value) filters['categoryId'] = filters['categoryId'].value
              else delete filters['categoryId']
            }
            let params = { page: page > 0 ? page - 1 : 0, limit: itemsPerPage, ...filters, sort: sorters } // set query params
            // console.log(params)
            try {
              const { data: { results, total } } = await http.get('/api/books', { params })
              // console.log('find books', results)
              records = results
              totalRecords = total
              return { status: 200, data: { records, totalRecords } }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          findOne: async ({ id }) => {
            try {
              const { data } = await http.get(`/api/books/${id}`)
              return { status: 200, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          create: async ({ record }) => {
            // console.log(payload)
            try {
              // check that you only insert what is needed...
              let { id, ...noIdData } = record
              delete noIdData.authors // remove authors
              const { data } = await http.post('/api/books', noIdData)
              return { status: 201, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          // TBD Set the linkages also
          update: async ({ record }) => {
            console.log('update payload', record)
            try {
              // check that you only save what is needed...
              // let { id, name, categoryId, authorIds } = record // authorIds
              let { id, ...noIdData } = record
              delete noIdData.authors // remove authors
              // console.log('record', id, name, categoryId, authorIds)
              const { data } = await http.patch(`/api/books/${id}`, noIdData) // TBD also update the author ids...?
              return { status: 200, data }
            } catch (e) {
              return { status: e.response.status, error: e.toString() }
            }
          },
          delete: null
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
      console.log('watch')
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
      // populate local data after opening form
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
