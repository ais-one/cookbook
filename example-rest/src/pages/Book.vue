<template>
  <div id="not-needed">
    <v-layout row wrap>
      <v-flex xs12>
        <vue-crud-x ref="book-table" storeName="book-table" :parentId="null" v-bind="bookDefs" @form-open="openBookForm">
          <template slot="filter" slot-scope="{ filterData, parentId, storeName }">
            <h1>Custom {{ storeName }} Filter Slot</h1>
            <div v-for="(filter, index) in filterData" :key="index">
              <component :is="filter.type" v-model="filter.value" v-bind="filter.attrs"></component>
            </div>
          </template>
          <!-- <template slot="table" slot-scope="{ records, totalRecs, pagination }">
            <div v-for="record in records" :key="record.id"><p>{{ record.id }} {{ record.name }} <v-btn @click="$refs['book-table'].crudFormOpen(record.id)">Open</v-btn></p></div>
            <div>{{ totalRecs }} {{ pagination }}</div>
          </template> -->
          <template slot="form" slot-scope="{ record, parentId, storeName }">
            <div>
              <h1>Custom {{ storeName }} Form Slot - Has Parent: {{ !!parentId }}</h1>
              <v-card-text>
                <v-text-field label="Name" v-model="record.name"></v-text-field>
                <v-select label="Category" v-model="record.categoryId" :items="categories" required item-text="name" item-value="id"></v-select>
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
                  <template slot="no-data">
                    <v-list-tile>
                      <v-list-tile-title>
                        No author yet...
                      </v-list-tile-title>
                    </v-list-tile>
                  </template>
                  <template slot="selection" slot-scope="{ item, selected }">
                    <v-chip :selected="selected" close @input="remove(item)">
                      <span v-text="item.name"></span>
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="{ item }">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="item.name"></v-list-tile-title>
                    </v-list-tile-content>
                  </template>
                </v-autocomplete>
                <v-btn @click.stop.prevent="gotoPages(record.id)" dark>View Book Pages</v-btn>
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
import VueCrudX from '@/VueCrudX'

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
  components: {
    VueCrudX
  },
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
          doPage: true,
          showFilterButton: false
        },

        crudFilter: {
          FilterVue: null,
          filterData: {
            name: {
              type: 'v-text-field',
              value: '',
              attrs: {
                label: 'Book Name', clearable: true
              }
            },
            categoryName: {
              type: 'v-select',
              value: { text: 'All', value: 0 },
              attrs: {
                label: 'Category',
                multiple: false,
                'return-object': true,
                items: [
                  { text: 'All', value: 0 }, { text: 'cat1', value: 1 }, { text: 'cat2', value: 2 }
                ],
                rules: [v => !!v || 'Item is required']
              }
            }
          }
        },

        crudForm: {
          FormVue: () => {},
          formAutoData: null,
          defaultRec: () => ({
            id: '',
            name: '',
            categoryId: '',
            categoryName: '',
            authorIds: [],
            authors: []
          })
        },

        crudOps: { // CRUD
          export: async (payload) => {
          },
          find: async (payload) => {
            let records = []
            const { pagination, filterData } = payload // pagination: { sortBy, descending }
            const { page, rowsPerPage } = pagination
            let params = { page: page > 0 ? page - 1 : 0, limit: rowsPerPage } // set query params
            if (filterData.name.value) params.name = filterData.name.value
            if (filterData.categoryName.value.value) params['category-id'] = filterData.categoryName.value.value
            try {
              const { data: { results, total } } = await http.get('/api/books', { params })
              // console.log('find books', results)
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
      if (val.length > 2) val.pop()
      if (this.$refs['book-table']) this.$refs['book-table'].record.authorIds = val
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
      this.authorIds = item.authorIds
      this.items = item.authors
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
