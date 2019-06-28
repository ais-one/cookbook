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

      // depends on UI Framework
      // Vuetify 2 Start
      pagination: {
        descending: false,
        page: 1,
        itemsPerPage: 20,
        sortBy: [],
        sortDesc: [],
        totalItems: 0 // completely useless at the moment
      },
      sorters: null,
      // Vuetify 2 End

      // V2
      idName: 'id',
      pageOptions: {
        infinite: false, // infinite scroll
        // page = null, limit = 0 // get all, show count in footer
        // page = null, limit = 20 // infinite scroll, hide pagination UI, add load more button
        // page > 0, limit = 20 // paged, 1-based
        page: 1, // initial page
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
    this.pagination.page = this.pageOptions.page
    this.pagination.itemsPerPage = this.pageOptions.limit

    this.headers = this.crudTable.headers
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

    this.ready = true
    this.getRecords({ mode: 'init' })
  },
  async mounted () {
    // not needed in data() because it does not exist in template, an optimization which should be done for others as well
    if (typeof this.$t !== 'function') { // if no internationalization
      this.$t = text => text
    }
    // for (let key in this.filters) { // type to field - TOREMOVE, populated in parent
    //   if (this.filters[key].attrs && this.filters[key].itemsFn) this.filters[key].attrs.items = await this.filters[key].itemsFn()
    // }
  },
  beforeUpdate () { },
  beforeRouteEnter (to, from, next) { next(vm => { }) },
  computed: {
    showTitle () { return this.crudTitle || 'VueCrudX' }
  },
  watch: {
    loading: function (newValue, oldValue) { }
    // parentId (value) {
    //   // console.log('watch parentId', value)
    //   this.getRecords({ mode: null })
    // }
  },
  methods: {
    goBack () { this.$router.back() }, // return from child
    updateTableRow ({ record }) { // also handles real-time updates
      const idx = this.records.findIndex(rec => rec[this.idName] === record[this.idName])
      if (idx !== -1) {
        for (let key in this.records[idx]) {
          if (key !== this.idName && record[key]) this.records[idx][key] = record[key]
        }
      }
    },
    deleteTableRow ({ id }) { // infinite scroll - case - also handles real-time updates
      if (this.pageOptions.infinite) {
        const idx = this.records.findIndex(rec => rec[this.idName] === id)
        if (idx !== -1) this.records.splice(idx, 1)
        this.totalRecords -= 1
      } else {

      }
    },
    createTableRow ({ record }) { // infinite scroll - case - also handles real-time updates
      if (this.pageOptions.infinite) {
        // ensure that record has the same fields as what is in this.records
        // const idx = this.records.findIndex(rec => rec[this.idName] === id)
        // if (idx !== -1) this.records.splice(idx, 1) this.records.splice(idx, 0, record)
        // // this.records.push(record)
        // // this.records.unshift(record)
        // this.totalRecords += 1
      } else {
        // always go to page 1
        this.pagination.page = 1 // will fire off page reload
      }
    },

    async deleteRecord ({ id }) {
      this.loading = true
      let res = await this.crudOps.delete({ id })
      this.loading = false
      this.$emit('deleted', { res, id })
    },
    async updateRecord ({ record }) {
      this.loading = true
      let res = await this.crudOps.update({ record })
      this.loading = false
      this.updateTableRow({ record })
      this.$emit('updated', { res, record })
      if (typeof res === 'object') return res.ok // TODEPRECATE this check
      else return res === 200 // TODEPRECATE
    },
    async createRecord (payload) {
      this.loading = true
      let res = await this.crudOps.create(payload)
      this.loading = false
      this.createTableRow({ record: null })
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
    closeForm () {
      this.showForm = false
      this.$emit('form-close')
    },
    async openForm (id) {
      this.selectedId = id
      if (id) {
        await this.getRecord({ id }) // edit
      } else { // add - set initial data
        for (let key in this.form) {
          // console.log(key, this.$attrs.form[key])
          this.form[key].value = this.$attrs.form[key].default || ''
        }
      }
      this.showForm = true
      this.$emit('form-open', this.form)
    },
    async crudFormSave (e) {
      let record = {}
      let id = this.selectedId
      for (let key in this.form) {
        if (key !== this.idName) record[key] = this.form[key].value // ignore id, get from selectedId
      }
      record[this.idName] = id
      if ((!id && this.confirmCreate) || (id && this.confirmUpdate)) if (!confirm(this.$t('vueCrudX.confirm'))) return
      if (id) {
        // console.log('update', record, this.selectedId, this.idName)
        await this.updateRecord({ record })
      } else {
        // console.log('create', record, this.selectedId, this.idName)
        await this.createRecord({ record, parentId: this.parentId })
      }
      if (this.formReload) await this.getRecords({ mode: record[this.idName] ? 'update' : 'create' })
      this.closeForm()
    },
    async crudFormDelete (e) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      const { id } = this.selectedId
      if (id) {
        await this.deleteRecord({ id })
        if (this.formReload) await this.getRecords({ mode: 'delete' })
      }
      this.closeForm()
    },
    // mode - normal paging - null
    //      - create
    //      - update
    //      - delete
    //      - filter - infinite scroll start from beginning
    async getRecords ({ mode }) {
      this.loading = true
      // TBD emit filter update event
      const payload = {
        parentId: this.parentId,
        filters: this.filters,
        pagination: this.pagination,
        sorters: null
      }
      console.log('getRecords', mode, this.pagination)
      let { records, totalRecords = 0, pagination = null } = await this.crudOps.find(payload) // pagination returns for infinite scroll
      if (pagination) {
        this.pagination.page = pagination.page
      }
      if (this.pageOptions.infinite) { // infinite scroll
        this.totalRecords += records.length
        this.records = this.records.concat(records)
      } else {
        // TBD
        // if (totalRecords > 0 && records.length === 0) {
        //  page = Math.ceil(totalRecords / this.pagination.itemsPerPage) need to reload page...
        // }
        this.totalRecords = totalRecords
        this.records = records
      }
      // TBD emit pagination update event
      // TBD this.$emit('loaded', Date.now())
      this.loading = false
    },
    async onFilter () {
      if (this.editing) this.editing = null
      this.totalRecords = 0
      this.records = []
      if (this.pageOptions.infinite) {
        this.pagination.page = this.pageOptions.page
        await this.getRecords({ mode: 'filter' })
      } else {
        await this.getRecords({ mode: 'filter' })
        // if (this.pagination.page === 1) {
        //   await this.getRecords({ mode: null })
        // } else {
        //   this.pagination.page = 1 // triggers page reload by watcher
        // }
      }
    },
    // clearFilter () { this.$refs.searchForm.reset() }, // can do test code here too
    async onExport () {
      this.loading = true
      await this.exportRecords({
        parentId: this.parentId,
        filters: this.filters,
        pagination: this.pagination,
        sorters: null
      })
      this.loading = false
    },

    // INLINE EDIT START
    isRowEditing (item) {
      if (!this.editing) return false
      return item[this.idName] === this.editing[this.idName]
    },
    async inlineUpdate (item) {
      if (!this.editing) { // start editing
        this.editing = { ...item } // backup the values first
      }
    },
    async inlineSave (item) {
      if (this.editing) {
        item = { ...this.editing }
        this.editing = null
        // const { id, ...record } = item
        try {
          await this.updateRecord({ record: item })
          // await this.getRecords({ mode: 'update-inline' }) // TBD find better way to update table - reload? if (reload?) this.$nextTick(async function () { await this.getRecords() })
        } catch (e) {
          // TBD handle failure
        }
      }
    },
    async inlineCancel (item) {
      if (this.editing) this.editing = null
    },
    async inlineCreate () {
      try {
        await this.createRecord({ record: {}, parentId: this.parentId })
        // await this.getRecords({ mode: 'create-inline' }) // TBD find better way to update table - reload? if (reload?) this.$nextTick(async function () { await this.getRecords() })
      } catch (e) {
        // TBD handle failure
      }
    },
    async inlineDelete (id) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      try {
        await this.deleteRecord({ id })
        // await this.getRecords({ mode: 'delete-inline' }) // TBD find better way to update table - reload? if (reload?) this.$nextTick(async function () { await this.getRecords() })
      } catch (e) {
        // TBD handle failure
      }
    },
    // INLINE EDIT END

    rowClicked (item, event) {
      console.log('clicked', item)
      if (!this.inline.edit) {
        if (this.onRowClickOpenForm) this.openForm(item[this.idName]) // no action column && row click opens form
      }
      this.$emit('row-selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
    },
    isHidden (item) {
      return (item.hidden === 'add' && !item[this.idName]) || (item.hidden === 'edit' && item[this.idName]) || item.hidden === 'all'
    },
    isReadOnly (item) {
      return (item.readonly === 'add' && !item[this.idName]) || (item.readonly === 'edit' && item[this.idName]) || item.readonly === 'all'
    },
    async onTable (_in) {
      console.log('onTable', _in)
      if (this.pageOptions.infinite) return // infinite scroll, ignore
      await this.getRecords({ mode: _in })
    },
    _isObject (obj) { return obj !== null && typeof obj === 'object' },
    async testFunction (_in) { // for testing anything
      // console.log('testFunction', this.pagination)
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
          <v-btn v-bind="attrs.button" @click="onFilter" :disabled="!validFilter || loading"><v-icon>{{buttons.reload.icon}}</v-icon><span>{{buttons.reload.label}}</span></v-btn>
          <v-btn v-if="crudOps.create" v-bind="attrs.button" @click.stop="inline.add?inlineCreate():openForm(null)" :disabled="loading"><v-icon>{{buttons.create.icon}}</v-icon><span>{{buttons.create.label}}</span></v-btn>
          <v-btn v-if="crudOps.export" v-bind="attrs.button" @click.stop.prevent="onExport" :disabled="loading"><v-icon>{{buttons.export.icon}}</v-icon><span>{{buttons.export.label}}</span></v-btn>
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
        <!--
          after sorter is clicked, page is changed to -1
          disable sorting for infinite scroll
          @sort-by not needed, only need @sort-desc
          @update:page="testFunction"
          @pagination="testFunction"
        -->
        <v-data-table
          :headers="headers"
          :items="records"
          :server-items-length="totalRecords"
          :options.sync="pagination"
          :page.sync="pagination.page"
          :hide-default-footer="pageOptions.infinite"
          :disable-sort="pageOptions.infinite"
          v-bind="attrs.table"
          :item-key="idName"
          fixed-header
          @update:page="onTable('page')"
          @update:sort-desc="onTable('sort')"
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
            <tr :key="item[idName]" :ref="`edit-${item[idName]}`" @click.stop="rowClicked(item, $event)">
              <slot name="td" :headers="headers" :item="item" :vcx="_self">
                <td :key="header.value + index" v-for="(header, index) in headers" :class="header['cell-class']?header['cell-class']:header.class">
                  <span v-if="header.action">
                    <v-icon v-if="crudOps.update&&inline.edit" v-bind="attrs['action-icon']" @click.stop="isRowEditing(item)?inlineSave(item):inlineUpdate(item)" :disabled="loading">{{ isRowEditing(item) ? 'save' : 'edit' }}</v-icon>
                    <v-icon v-else-if="crudOps.update&&!inline.edit&&form" v-bind="attrs['action-icon']" @click.stop="openForm(item[idName])" :disabled="loading">edit</v-icon>
                    <v-icon v-if="crudOps.delete" v-bind="attrs['action-icon']" @click.stop="isRowEditing(item)?inlineCancel(item):inlineDelete(item[idName])" :disabled="loading">{{ isRowEditing(item) ? 'cancel' : 'delete' }}</v-icon>
                  </span>
                  <template v-else>
                    <component v-if="inline.edit&&isRowEditing(item)" :disabled="!header.edit" :is="'v-text-field'" :key="item[idName]+'-'+item[header.value]" v-model="editing[header.value]"></component>
                    <span v-else v-html="header.render?header.render(item[header.value]):item[header.value]"></span>
                  </template>
                </td>
              </slot>
            </tr>
          </template>
          <!-- infinite scroll handling -->
          <template v-if="pageOptions.infinite" v-slot:footer="props">
            <v-btn v-if="pagination.page" @click="getRecords({ mode: 'infinite' })">Load More {{ props.length }}</v-btn>
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
          <v-toolbar-title><v-btn v-bind="attrs.button" @click.native="closeForm" :disabled="loading"><v-icon>{{buttons.close.icon}}</v-icon><span>{{buttons.close.label}}</span></v-btn> {{showTitle}}</v-toolbar-title>
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
