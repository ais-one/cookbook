<script>
// Notes:
// IMPORTANT - important point to take not of
// TBD - to be done
// TOREMOVE - to be removed
// TODEPRECATE - to deprecate & remove

// import _cloneDeep from 'lodash.clonedeep'

export default {
  props: {
    parentId: { type: String, default: null },

    // v1
    crudFilter: { type: Object, required: false },
    crudForm: { type: Object, required: false },
    crudTable: { type: Object, required: true },
    crudOps: { type: Object, required: true }
  },
  data () {
    return {
      ready: false,

      loading: false,
      records: [], // get many - filter, page & sort
      totalRecords: 0,
      cursor: '', // infinite scroll cursor

      paginationRefresh: true,
      formReload: true, // refetch after create, update or delete

      // show/hide
      showFilterButton: true, // should the filter button be shown?
      showFilter: false,
      showForm: false,

      onRowClickOpenForm: true, // set to false of you do not want row click to open form

      validForm: true, // form
      validFilter: true, // filter

      // crudTable
      headers: [ ], // pass in

      inlineReload: { // set to false for services where record read is chargeable, e.g. Google Firestore (use listeners instead)
        create: true,
        update: true,
        delete: true
      },

      confirmCreate: false, // confirmation required flags
      confirmUpdate: false,
      confirmDelete: true,
      crudTitle: '', // title
      showGoBack: false,

      // styling
      attrs: {
        // you can add attributes used by the component and customize style and classes
        container: { // v-container Component
          fluid: true,
          class: 'pa-2', // parentId ? 'make-modal' : ''
          style: { }
        },
        form: { // v-form Component
          class: 'grey lighten-3 pa-2',
          style: {
            overflow: 'auto'
          },
          'lazy-validation': true
        },
        toolbar: { // v-toolbar Component
          height: 48,
          dark: false,
          light: true,
          color: 'grey',
          fixed: false
        },
        table: { // v-data-table Component
          dark: false,
          light: true,
          'items-per-page-options': [2, 5, 10, 20],
          'hide-default-header': false,
          style: { // this may need to be changed once Vuetify version 2.0 is out
            'max-height': 'calc(100vh - 144px)',
            // 'overflow-y': 'scroll',
            'backface-visibility': 'hidden'
          }
        },
        button: { // v-btn Component
          dark: false,
          light: true,
          icon: true,
          fab: false
        },
        'action-icon': { // for the action column
          small: true,
          class: 'mr-1'
        }
      },
      buttons: {
        // table
        back: { icon: 'reply', label: '' },
        filter: { icon: 'search', label: '', icon2: 'keyboard_arrow_up' },
        reload: { icon: 'replay', label: '' },
        create: { icon: 'add', label: '' },
        export: { icon: 'print', label: '' },
        // form
        close: { icon: 'close', label: '' },
        delete: { icon: 'delete', label: '' },
        update: { icon: 'save', label: '' }
      },

      // v1 v2
      // page = null, limit = 0 // get all
      // page = null, limit = 20 // infinite scroll
      // page > 0, limit = 20 // paged
      infinite: false, // either paged or infinite scroll
      editing: null, // or row object
      pagination: { // depends on UI Framework
        descending: false,
        page: 1,
        itemsPerPage: 20,
        sortBy: [],
        totalItems: 0 // completely useless at the moment
      },

      // V2
      idName: 'id',
      pageOptions: {
        // page = null, limit = 0 // get all, show count in footer
        // page = null, limit = 20 // infinite scroll, hide pagination UI, add load more button
        // page > 0, limit = 20 // paged, 1-based
        page: 1,
        limit: 2
      },
      inline: {
        add: false,
        edit: false
      },
      filters: null,
      form: null,
      selectedId: null
    }
  },
  async created () {
    this.ready = false
    // TODEPRECATE - remove crudFilter, convert as object to array
    this.filters = (this.crudFilter && this.crudFilter.filterData) ? this.crudFilter.filterData : this.$attrs.filters || null // Set initial filter data here
    // TODEPRECATE - remove crudForm, convert as object to array // deal with this.crudForm!
    this.form = this.$attrs.form || null // Set initial form data here
    this.idName = this.$attrs.idName || 'id'
    this.pageOptions = this.$attrs.pageOptions || { page: 1, limit: 2 }
    this.inline = this.$attrs.inline || { add: false, edit: false }

    // Set initial pagination data here
    this.paginationRefresh = false
    this.pagination.page = this.pageOptions.page
    this.pagination.itemsPerPage = this.pageOptions.limit
  },
  async mounted () {
    // TOREMOVE this.paginationRefresh = !!this.$scopedSlots['table']
    this.headers = this.crudTable.headers
    this.inlineReload = Object.assign(this.inlineReload, this.crudTable.inlineReload || {}) // default true
    this.formReload = this.crudTable.formReload !== false // default true

    this.onRowClickOpenForm = this.crudTable.onRowClickOpenForm !== false // open form on row click? default true

    // set confirmation
    this.confirmCreate = this.crudTable.confirmCreate === true // default false
    this.confirmUpdate = this.crudTable.confirmUpdate === true // default false
    this.confirmDelete = this.crudTable.confirmDelete !== false // default true

    this.crudTitle = this.crudTable.crudTitle || '' // title
    this.showGoBack = this.crudTable.showGoBack !== false // hide go back button - default true
    this.showFilterButton = this.crudTable.showFilterButton !== false // show filter button - default true

    // more attributes
    this.attrs = Object.assign(this.attrs, this.crudTable.attrs || {})
    this.buttons = Object.assign(this.buttons, this.crudTable.buttons || {})

    // not needed in data() because it does not exist in template, an optimization which should be done for others as well
    if (typeof this.$t !== 'function') { // if no internationalization
      this.$t = text => text
    }
    // for (let key in this.filters) { // type to field - TOREMOVE, populated in parent
    //   if (this.filters[key].attrs && this.filters[key].itemsFn) this.filters[key].attrs.items = await this.filters[key].itemsFn()
    // }
    this.ready = true
  },
  beforeUpdate () { },
  beforeRouteEnter (to, from, next) { next(vm => { }) },
  computed: {
    showTitle () { return this.crudTitle || 'VueCrudX' }
  },
  watch: {
    loading: function (newValue, oldValue) { },
    pagination: {
      handler (value, oldvalue) {
        if (this.paginationRefresh === false) {
          this.paginationRefresh = true
        } else {
          this.getRecords()
        }
      },
      deep: true
    },
    parentId (value) {
      // console.log('watch parentId', value)
      this.getRecords()
    }
  },
  methods: {
    isObject (obj) { return obj !== null && typeof obj === 'object' },
    async deleteRecord (payload) {
      this.loading = true
      let res = await this.crudOps.delete(payload)
      this.loading = false
      this.$emit('deleted', { res, payload })
    },
    async updateRecord (payload) {
      this.loading = true
      let res = await this.crudOps.update(payload)
      this.loading = false
      this.$emit('updated', { res, payload })
      if (typeof res === 'object') return res.ok // TODEPRECATE this check
      else return res === 200 // TODEPRECATE
    },
    async createRecord (payload) {
      this.loading = true
      let res = await this.crudOps.create(payload)
      this.loading = false
      this.$emit('created', { res, payload }) // no ID yet, TBD...
    },
    async getRecord ({ id }) {
      this.loading = true
      const result = await this.crudOps.findOne({ id })
      for (let key in this.form) {
        this.form[key].value = result[key]
      }
      this.loading = false
    },
    async exportRecords (payload) {
      await this.crudOps.export(payload)
    },
    closeCrudForm () {
      this.showForm = false
      this.$emit('form-close')
    },
    async crudFormOpen (id) {
      this.selectedId = id
      if (id) {
        await this.getRecord({ id }) // edit
      } else { // add - set initial data
        for (let key in this.form) {
          this.form[key].value = this.$attrs.form[key].default || ''
        }
      }
      this.showForm = true
      this.$emit('form-open', this.form)
    },
    async crudFormSave (e) {
      let record = {}
      let id = null
      for (let key in this.form) {
        if (key === this.idName) id = this.form[key].value
        else record[key] = this.form[key].value
      }

      if ((!record[this.idName] && this.confirmCreate) || (record[this.idName] && this.confirmUpdate)) if (!confirm(this.$t('vueCrudX.confirm'))) return
      if (record[this.idName]) await this.updateRecord({ id, record })
      else await this.createRecord({ record, parentId: this.parentId })
      if (this.formReload) await this.getRecords({ mode: record[this.idName] ? 'update' : 'create' })
      this.closeCrudForm()
    },
    async crudFormDelete (e) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      const { id } = this.selectedId
      if (id) {
        await this.deleteRecord({ id })
        if (this.formReload) await this.getRecords({ mode: 'delete' })
      }
      this.closeCrudForm()
    },
    // mode - normal paging - null
    //      - create
    //      - update
    //      - delete
    //      - filter - infinite scroll start from beginning
    async getRecords () {
      this.loading = true
      // TBD emit filter update event
      const payload = {
        user: this.$store.getters.user,
        pagination: this.pagination,
        filters: this.filters,
        parentId: this.parentId
      }
      console.log('getRecords', this.pagination.page)
      let { records, totalRecords = 0, cursor } = await this.crudOps.find(payload) // pagination returns cursor for infinite scroll
      if (cursor !== undefined) { // infinite scroll
        this.cursor = cursor
        this.totalRecords += records.length
        this.records = this.records.concat(records)
      } else {
        this.totalRecords = totalRecords
        this.records = records
      }
      // TBD emit pagination update event
      // TBD this.$emit('loaded', Date.now())
      this.loading = false
    },
    async submitFilter () {
      if (this.editing) this.editing = null
      this.totalRecords = 0
      this.records = []
      this.cursor = ''
      if (this.pageOptions.page) {
        // TOREMOVE await this.getRecords()
        this.pagination.page = 1 // triggers page reload
      } else {
        this.pagination.page = 1 // this triggers the page reload by watcher, if using event, then this mechanism will change
      }
    },
    // clearFilter () { this.$refs.searchForm.reset() }, // can do test code here too
    async exportBtnClick () {
      this.loading = true
      await this.exportRecords({
        pagination: this.pagination,
        filters: this.filters,
        parentId: this.parentId
      })
      this.loading = false
    },
    goBack () {
      this.$router.back()
    },

    // INLINE EDIT START
    rowEditing (item) {
      if (!this.editing) return false
      return item[this.idName] === this.editing[this.idName]
    },
    async inlineUpdate (item) {
      console.log('inlineUpdate', item)
      if (!this.editing) { // start editing
        this.editing = { ...item } // backup the values first
      }
    },
    async inlineSave (item) {
      if (this.editing) {
        item = { ...this.editing }
        this.editing = null
        const { id, ...record } = item
        try {
          await this.updateRecord({ id, record })
          await this.getRecords({ mode: 'update' }) // TBD find better way to update table - reload? if (this.inlineReload.delete) this.$nextTick(async function () { await this.getRecords() })
        } catch (e) { }
      }
    },
    async inlineCancel (item) {
      if (this.editing) this.editing = null
    },
    async inlineCreate () {
      try {
        await this.createRecord({ record: {}, parentId: this.parentId })
        await this.getRecords({ mode: 'create' }) // TBD find better way to update table - reload? if (this.inlineReload.delete) this.$nextTick(async function () { await this.getRecords() })
      } catch (e) { }
    },
    async inlineDelete (id) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      try {
        await this.deleteRecord({ id })
        await this.getRecords({ mode: 'delete' }) // TBD find better way to update table - reload? if (this.inlineReload.delete) this.$nextTick(async function () { await this.getRecords() })
      } catch (e) { }
    },
    // INLINE EDIT END

    rowClicked (item, event) {
      console.log('clicked', item)
      if (!this.inline.edit) {
        if (this.onRowClickOpenForm) this.crudFormOpen(item[this.idName]) // no action column && row click opens form
      }
      this.$emit('row-selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
    },
    isHidden (item) {
      return (item.hidden === 'add' && !item[this.idName]) || (item.hidden === 'edit' && item[this.idName]) || item.hidden === 'all'
    },
    isReadOnly (item) {
      return (item.readonly === 'add' && !item[this.idName]) || (item.readonly === 'edit' && item[this.idName]) || item.readonly === 'all'
    },
    async testFunction (_in) { // for testing anything
      console.log(_in)
    }
  }
}
</script>

<template>
  <v-container v-if="ready" v-bind="attrs.container">
    <!-- progress overlay -->
    <slot name="progress" :vcx="_self">
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </slot>
    <!-- filter & table -->
    <component :is="'div'" v-show="!showForm">
      <slot name="table-toolbar" :vcx="_self">
        <v-toolbar v-bind="attrs.toolbar">
          <v-toolbar-title><v-btn v-if="parentId && showGoBack" v-bind="attrs.button" @click.stop="goBack" :disabled="loading"><v-icon>{{buttons.back.icon}}</v-icon><span>{{buttons.back.label}}</span></v-btn> {{ showTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="showFilterButton&&filters" v-bind="attrs.button" @click="showFilter=!showFilter"><v-icon>{{ showFilter ? buttons.filter.icon2 : buttons.filter.icon }}</v-icon><span>{{buttons.filter.label}}</span></v-btn>
          <v-btn v-bind="attrs.button" @click="submitFilter" :disabled="!validFilter || loading"><v-icon>{{buttons.reload.icon}}</v-icon><span>{{buttons.reload.label}}</span></v-btn>
          <v-btn v-if="crudOps.create" v-bind="attrs.button" @click.stop="inline.add?inlineCreate():crudFormOpen(null)" :disabled="loading"><v-icon>{{buttons.create.icon}}</v-icon><span>{{buttons.create.label}}</span></v-btn>
          <v-btn v-if="crudOps.export" v-bind="attrs.button" @click.stop.prevent="exportBtnClick" :disabled="loading"><v-icon>{{buttons.export.icon}}</v-icon><span>{{buttons.export.label}}</span></v-btn>
        </v-toolbar>
      </slot>
      <div v-if="showFilter">
        <slot name="filter" :filters="filters" :parentId="parentId" :vcx="_self">
          <v-form v-if="filters" v-model="validFilter" ref="searchForm" v-bind="attrs.form">
            <v-layout row wrap>
              <template v-for="(filter, i) in filters">
                <v-flex :key="i" v-bind="filter['field-wrapper']">
                  <component :is="filter.type" v-model="filter.value" v-bind="filter['field-input']" />
                </v-flex>
              </template>
            </v-layout>
          </v-form>
        </slot>
      </div>
      <slot name="table" :records="records" :totalRecords="totalRecords" :pagination="pagination" :vcx="_self">
        <v-data-table
          :headers="headers"
          :items="records"
          :server-items-length="totalRecords"
          :options.sync="pagination"
          :hide-default-footer="!pageOptions.page"
          v-bind="attrs.table"
          :item-key="idName"
          fixed-header
          @pagination="testFunction"
        >
          <template v-slot:headerCell="props">
            <span v-html="props.header.text"></span>
          </template>

          <!-- Overide Entire Table -->
          <!-- <template v-slot:body="{ items }">
            <tr v-for="item in items" :key="item[idName]">
              <td>
            </tr>
          </template> -->

          <!-- <template v-slot:item.data-table-select="{ on, props }">
            <v-simple-checkbox color="green" v-bind="props" v-on="on"></v-simple-checkbox>
          </template> -->

          <template v-slot:item="{ item }"><!-- was items -->
            <tr :ref="`edit-${item[idName]}`" @click.stop="rowClicked(item, $event)">
              <slot name="td" :headers="headers" :item="item" :vcx="_self">
                <td :key="header.value + index" v-for="(header, index) in headers" :class="header['cell-class']?header['cell-class']:header.class">
                  <span v-if="header.action">
                    <v-icon v-if="crudOps.update&&inline.edit" v-bind="attrs['action-icon']" @click.stop="rowEditing(item)?inlineSave(item):inlineUpdate(item)" :disabled="loading">{{ rowEditing(item) ? 'save' : 'edit' }}</v-icon>
                    <v-icon v-else-if="crudOps.update&&!inline.edit&&form" v-bind="attrs['action-icon']" @click.stop="crudFormOpen(item[idName])" :disabled="loading">edit</v-icon>
                    <v-icon v-if="crudOps.delete" v-bind="attrs['action-icon']" @click.stop="rowEditing(item)?inlineCancel(item):inlineDelete(item[idName])" :disabled="loading">{{ rowEditing(item) ? 'cancel' : 'delete' }}</v-icon>
                  </span>
                  <template v-else>
                    <component v-if="inline.edit&&rowEditing(item)" :is="'v-text-field'" :key="item[idName]+'-'+item[header.value]" v-model="editing[header.value]"></component>
                    <span v-else v-html="header.render?header.render(item[header.value]):item[header.value]"></span>
                  </template>
                </td>
              </slot>
            </tr>
          </template>
          <!-- infinite scroll handling -->
          <template v-if="!pageOptions.page" v-slot:footer="props">
            <v-btn v-if="cursor" @click="pagination.page=cursor">Load More {{ props.length }}</v-btn>
          </template>

          <template v-slot:no-data>
            <v-alert :value="!loading&&!records.length" color="error" icon="warning">{{$t?$t('vueCrudX.noData'):'NO DATA'}}</v-alert>
          </template>
        </v-data-table>
      </slot>
    </component>
    <!-- form -->
    <component :is="'div'" v-show="showForm" row justify-center>
      <slot name="form-toolbar" :vcx="_self">
        <v-toolbar v-bind="attrs.toolbar">
          <v-toolbar-title><v-btn v-bind="attrs.button" @click.native="closeCrudForm" :disabled="loading"><v-icon>{{buttons.close.icon}}</v-icon><span>{{buttons.close.label}}</span></v-btn> {{showTitle}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn v-bind="attrs.button" v-if="crudOps.delete && selectedId" @click.native="crudFormDelete" :disabled="loading"><v-icon>{{buttons.delete.icon}}</v-icon><span>{{buttons.delete.label}}</span></v-btn>
            <v-btn v-bind="attrs.button" v-if="crudOps.update && selectedId||crudOps.create && !selectedId" :disabled="!validForm||loading" @click.native="crudFormSave"><v-icon>{{buttons.update.icon}}</v-icon><span>{{buttons.update.label}}</span></v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </slot>
      <slot name="form" :form="form" :parentId="parentId" :vcx="_self">
        <v-form v-model="validForm" v-bind="attrs.form"  :parentId="parentId" :vcx="_self">
          <v-layout row wrap>
            <template v-for="(item, i) in form">
              <v-flex :key="i" v-if="!isHidden(item)" v-bind="item['field-wrapper']">
                <component :is="item.type" v-model="item.value" v-bind="item['field-input']" />
              </v-flex>
            </template>
          </v-layout>
        </v-form>
      </slot>
    </component>
  </v-container>
</template>

<style scoped>
</style>
