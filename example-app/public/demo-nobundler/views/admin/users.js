const template = /*html*/`
<template>
  <div class="container">
    <div v-if="!form || form==='filters'">
      <div v-if="form==='filters'" class="card">
        <div class="card-content">
          <div class="content">
            <!-- b-field label="Email" label-position="on-border"><b-input v-model="filters.email"></b-input></b-field -->
            <b-field>
              <b-switch v-model="filters.active">{{ filters.active ? 'Active' : 'InActive' }}</b-switch>
            </b-field>
            <button class="button is-small" @click="formAction"><span>Reset</span></button>
          </div>
        </div>
      </div>

      <b-table
        style="max-height: calc(100vh - 52px);overflow-y: auto;"
        :columns="columns"
        :data="data"
        :loading="loading"

        paginated
        backend-pagination
        pagination-position="top"
        pagination-size="is-small"
        :total="total"
        :per-page="perPage"
        @page-change="onPageChange"

        @select="rowSelected"
        :selected.sync="selected"

        backend-sorting
        :default-sort-direction="defaultSortOrder"
        :default-sort="[sortField, sortOrder]"
        @sort="onSort"
        focusable
      >
        <template v-slot:top-left>
          <div class="field has-addons">
            <p class="control">
              <button class="button is-small" @click="toggleFilter">
                <span class="icon is-small"><i class="mdi mdi-magnify"></i></span>
              </button>
            </p>
            <p class="control">
              <button class="button is-small"@click="loadAsyncData">
                <span class="icon is-small"><i class="mdi mdi-reload"></i></span>
              </button>
            </p>
            <p class="control">
              <button class="button is-small" @click="doAdd">
                <span class="icon is-small"><i class="mdi mdi-plus"></i></span>
                <!-- span>ADd</span -->
              </button>
            </p>
            <!-- p class="control">
              <button class="button is-small">
                <span class="icon is-small"><i class="mdi mdi-delete"></i></span>
              </button>
            </p -->
            &nbsp;User
          </div>
        </template>
      </b-table>
    </div>
    <div v-else>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{{ form === 'add' ? 'Add' : 'Edit' }}</p>
        </header>
        <div class="card-content">
          <div class="content">
            <b-field v-if="form==='edit'" label="Id">
              <b-input v-model="addEdit._id" readonly></b-input>
            </b-field>        
            <b-field label="User Ref" label-position="on-border">
              <b-input v-model="addEdit.userRef"></b-input>
            </b-field>
            <b-field label="Email" label-position="on-border"><b-input v-model="addEdit.email"></b-input></b-field>
            <b-field label="Company Name" label-position="on-border"><b-input v-model="addEdit.companyName"></b-input></b-field>

            <b-field label="Role" label-position="on-border"><b-input v-model="addEdit.role"></b-input></b-field>
            <b-field label="Password" label-position="on-border"><b-input v-model="addEdit.password"></b-input></b-field>

            <b-field>
              <b-switch v-model="addEdit.active">{{ addEdit.active ? 'Active' : 'InActive' }}</b-switch>
            </b-field>

            <button class="button is-small" @click="formAction"><span>Submit</span></button>
            <button class="button is-small" @click="formCancel"><span>Cancel</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
`
import { PAGE_SIZE } from '../../config.js'
import api from '../../api.js'

export default {
  template,
  computed: {
    token: function () { return this.$store.getters.token }
  },
  data() {
    return {
      form: '',
      addEdit: {
        _id: '',
        email: '',
        userRef: '',
        password: '', // 1111
        companyName: '',
        role: '',
        active: true
      },
      filters: {
        email: '',
        active: true
      },
      columns: [
        { field: 'email', label: 'Email', sortable: true },
        { field: 'userRef', label: 'User Ref' }, // actually company Ref
        { field: 'companyName', label: 'Company' }
      ],
      data: [],
      selected: null,
      total: 0,
      loading: false,
      sortField: 'email',
      sortOrder: 'desc',
      defaultSortOrder: 'desc',
      page: 1,
      perPage: PAGE_SIZE
    }
  },
  mounted() {
    this.loadAsyncData()
  },
  // watch: {
  //   selected(n, o) { console.log(n, o) }
  // },
  methods: {
    resetForm () {
      this.addEdit = {
        _id: '',
        userRef: '',
        email: '',
        password: '',
        companyName: '',
        role: '',
        active: true
      }
    },
    async formAction () {
      if (this.loading) return
      this.loading = true
      if (this.form === 'filters') {
        console.log('TBD handle filters')
      } else {
        const { _id, ...body } = this.addEdit // shallow copy
        console.log(_id, body)
        if (this.form === 'add') {
          try {
            let res = await api.create('/api/crud/user', body)             
            console.log(res)
            alert('Created. Please Reload And Search')
          } catch (e) {
            alert('Create Error')
          }    
        } else {
          try {
            let res = await api.update('/api/crud/user/' + _id, body)             
            console.log(res)
            alert('Updated. Please Reload And Search')
          } catch (e) {
            console.log('www', e)
            alert('Update Error')
          }    
        }
        this.form = ''
        this.selected = null
      }
      this.loading = false
    },
    async formCancel () {
      this.form = ''
      this.selected = null
    },
    async rowSelected(n, o) { // doEdit
      try {
        let res = await api.find('/api/crud/user/' + n._id)
        const rv = await res.json()
        this.addEdit = rv
        this.form = 'edit'
      } catch (e) { }
    },
    async toggleFilter() {
      if (this.form === 'filters') this.form = ''
      else this.form = 'filters'
    },
    async doAdd() {
      this.form = 'add'
      this.resetForm()
    },
    async loadAsyncData() {
      // console.log(this.sortField, this.sortOrder)
      if (this.loading) return

      this.loading = true
      try {
        const params = {
          page: this.page,
          sort: this.sortField + ',' + this.sortOrder
        }
        for (let key in this.filters) {
          if (this.filters[key] || this.filters[key] === false) params[key] = this.filters[key]
        }
        let res = await api.find('/api/crud/user', params)             
        const rv = await res.json()
        this.data = rv.results
        this.total = rv.total
      } catch (e) {
        this.data = []
        this.total = 0
        console.log(e.toString())
      }
      this.loading = false
    },
    // Handle page-change event
    onPageChange(page) {
      this.page = page
      this.loadAsyncData()
    },
    // Handle sort event
    onSort(field, order) {
      this.sortField = field
      this.sortOrder = order
      this.loadAsyncData()
    }
  }
}