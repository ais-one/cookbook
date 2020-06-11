<script>
// Notes:
// TBD / TODO - todos
// VARIATION - Note this code block when implementing on other UI Framework
// IMPORTANT - important point to take not of
// TOREMOVE - to be removed
// TODEPRECATE - to deprecate & remove
// UNUSED - not used

export default {
  props: {
    parentId: { type: String, default: null }
  },
  data () {
    return {
      // Private Properties Do Not Override - Start
      ready: false, // TODELETE May Not Be Needed Anymore...
      loading: false,
      records: [],
      totalRecords: 0,
      showFilter: false, // show/hide
      showForm: false,
      validFilter: true, // form validation
      validForm: true,
      editingRow: null, // for row editing... null or row object
      cursor: '', // infinite scroll cursor
      selectedId: null, //  selected record Id
      // Private Properties Do Not Override - End

      // VARIATION - Start Vuetify 2
      vbtn: { // v-btn Component
        back: { icon: 'reply', label: '', props: { dark: false, light: true, icon: true, fab: false } },
        filter: { icon: 'search', label: '', icon2: 'keyboard_arrow_up', props: { dark: false, light: true, icon: true, fab: false } },
        reload: { icon: 'replay', label: '', props: { dark: false, light: true, icon: true, fab: false } },
        create: { icon: 'add', label: '', props: { dark: false, light: true, icon: true, fab: false } },
        export: { icon: 'print', label: '', props: { dark: false, light: true, icon: true, fab: false } },
        close: { icon: 'close', label: '', props: { dark: false, light: true, icon: true, fab: false } },
        delete: { icon: 'delete', label: '', props: { dark: false, light: true, icon: true, fab: false } },
        update: { icon: 'save', label: '', props: { dark: false, light: true, icon: true, fab: false } },
        more: {
          icon: '',
          label: 'Load More',
          props: null,
          wrapper: {
            style: {
              display: 'flex',
              'justify-content': 'center'
            }
          }
        }
      },
      vicon: { // v-icon Component
        edit: { name: 'edit', props: { small: true, class: 'mr-1' } },
        save: { name: 'save', props: { small: true, class: 'mr-1' } },
        cancel: { name: 'cancel', props: { small: true, class: 'mr-1' } },
        delete: { name: 'delete', props: { small: true, class: 'mr-1' } }
      },
      vtoolbar: { height: 48, dark: false, light: true, color: 'grey' }, // v-toolbar Component
      vformFilter: { class: 'grey lighten-3 pa-2', style: { overflow: 'auto' }, 'lazy-validation': true }, // v-form Component for filter
      vformCrud: { class: 'grey lighten-3 pa-2', style: { overflow: 'auto' }, 'lazy-validation': true }, // v-form Component for CRUD
      vtable: { // props
        headers: [],
        'footer-props': {
          'items-per-page-options': [2, 5, 10, 25]
        },
        dense: true,
        'multi-sort': false,
        'fixed-header': true,
        dark: false,
        light: true,
        // 'rows-per-page-items': [],
        'hide-default-header': false,
        height: 'calc(100vh - 200px)'
      },
      // VARIATION - End Vuetify2

      // depends on UI Framework
      pageSize: 2,
      pageSizeOptions: [2, 5, 10, 25],
      pagination: {
        // VARIATION - Start Vuetify2
        page: 1,
        itemsPerPage: 2,
        sortBy: [],
        sortDesc: []
        // totalItems: 0 // completely useless at the moment
        // VARIATION - End Vuetify2
      },
      sorters: { // Not Used In Vuetify
      },
      pageDefaults: { // page options
        // VARIATION - Start Vuetify2
        start: 1,
        itemsPerPage: 2,
        sortBy: [],
        sortDesc: []
        // VARIATION - End Vuetify2
      },
      sortDefaults: { // Not Used In Vuetify
      },

      idName: 'id',
      infinite: false, // either paged or infinite scroll
      inline: { create: false, update: false, delete: false }, // inline functionality
      title: '',

      filters: null,
      form: null,
      crud: {
        create: null, // operations
        update: null,
        'delete': null,
        find: () => ({ status: 500, error: '' }),
        findOne: () => ({ status: 500, error: '' }),
        export: null
      }

      // Overrideable Methods
      // onRowClick; created, updated, deleted; confirmCreate, confirmUpdate, confirmDelete; notifyCreate, notifyUpdate, notifyDelete, notifyExport, notifyFind, notifyFindOne
    }
  },
  async created () {
    this.ready = true

    this.idName = this.$attrs.idName || 'id'
    this.infinite = !!this.$attrs.infinite // default false
    this.title = this.$attrs.title || 'Title'

    // VARIATION Start Vuetify2
    this.vicon = Object.assign(this.vicon, this.$attrs.vicon || {})
    this.vbtn = Object.assign(this.vbtn, this.$attrs.vbtn || {})
    this.vformFilter = Object.assign(this.vformFilter, this.$attrs.vformFilter || {})
    this.vformCrud = Object.assign(this.vformCrud, this.$attrs.vformCrud || {})
    this.vtoolbar = Object.assign(this.vtoolbar, this.$attrs.vtoolbar || {})
    this.vtable = Object.assign(this.vtable, this.$attrs.vtable || {})
    console.log("this.$attrs.pageSizeOptions", this.$attrs.pageSizeOptions)
    if (this.$attrs.pageSizeOptions && this.$attrs.pageSizeOptions.length) {
      this.vtable['footer-props']['items-per-page-options'] = this.$attrs.pageSizeOptions
      console.log("this.vtable['footer-props']['items-per-page-options']", this.vtable['footer-props']['items-per-page-options'])
    }
    this.sorters = Object.assign(this.sorters, this.$attrs.sorters || {})
    this.sortDefaults = Object.assign(this.sortDefaults, this.$attrs.sortDefaults || {})
    this.pageDefaults = Object.assign(this.pageDefaults, this.$attrs.pageDefaults || {})
    this.pageDefaults.itemsPerPage = Number(this.$attrs.pageSize) || this.pageSize 
    this.pagination = {
      ...this.pagination,
      page: this.pageDefaults.start,
      itemsPerPage: this.pageDefaults.itemsPerPage,
      sortBy: this.pageDefaults.sortBy,
      sortDesc: this.pageDefaults.sortDesc
    }
    if (this.infinite) this.cursor = this.pageDefaults.start
    // VARIATION End Vuetify2

    this.crud = Object.assign(this.crud, this.$attrs.crud || {})
    this.filters = this.$attrs.filters || null
    this.inline = Object.assign(this.inline, this.$attrs.inline || {})
    this.form = this.$attrs.form || null

    // non-ui reactive data - START
    this.onRowClick = this.$attrs.onRowClick || ((item, event, vcx) => { // open form on row click? default true
      if (!this.inline.update) this.formOpen(item[this.idName]) // no action column && row click opens form
    })
    this.created = this.$attrs.created || (async ({ data }) => { // do not handle realtime updates of create
      this.filters = this.$attrs.filters || null
      this.pagination.page = this.pageDefaults.start
      this.pagination.sortBy = this.pageDefaults.sortBy
      this.pagination.sortDesc = this.pageDefaults.sortDesc
      await this.getRecords({ mode: 'created' })
    })
    this.deleted = this.$attrs.deleted || (async (id) => { // do not handle realtime updates of delete
      this.filters = this.$attrs.filters || null
      this.pagination.page = this.pageDefaults.start
      this.pagination.sortBy = this.pageDefaults.sortBy
      this.pagination.sortDesc = this.pageDefaults.sortDesc
      await this.getRecords({ mode: 'deleted' })
    })
    this.updated = this.$attrs.updated || (({ data }) => { // also handles real-time updates
      const idx = this.records.findIndex(rec => rec[this.idName] === data[this.idName])
      if (idx !== -1) {
        for (let key in this.records[idx]) {
          if (key !== this.idName && data[key]) this.records[idx][key] = data[key]
        }
      }
    })
    // notifications
    this.notifyCreate = this.$attrs.notifyCreate || ( ({ status, error }) => (status === 200 || status === 201) ? alert('Create OK') : alert('Create Error ' + error.toString()) )
    this.notifyUpdate = this.$attrs.notifyUpdate || ( ({ status, error }) => (status === 200 || status === 201) ? alert('Update OK') : alert('Update Error ' + error.toString()) )
    this.notifyDelete = this.$attrs.notifyDelete || ( ({ status, error }) => (status === 200 || status === 201) ? alert('Delete OK') : alert('Delete Error ' + error.toString()) )
    this.notifyExport = this.$attrs.notifyExport || (({ status, error }) => { if (!(status === 200 || status === 201)) alert('Export Error ' + error.toString()) })
    this.notifyFind = this.$attrs.notifyFind || (({ status, error }) => { if (!(status === 200 || status === 201)) alert('Find Error ' + error.toString()) })
    this.notifyFindOne = this.$attrs.notifyFindOne || (({ status, error }) => { if (!(status === 200 || status === 201)) alert('FindOne Error ' + error.toString()) })
    // confirmations - do this part after getting inline status
    this.confirmCreate = this.$attrs.confirmCreate || (() => this.inline.create ? confirm(this.$t('vueCrudX.confirm')) : true) // default only confirm if inline create
    this.confirmUpdate = this.$attrs.confirmUpdate || (() => true) // default always no need confirmation
    this.confirmDelete = this.$attrs.confirmDelete || (() => confirm(this.$t('vueCrudX.confirm'))) // default always need confirmation
    // non-ui reactive data - END
  },
  async mounted () {
    // not needed in data() because it does not exist in template, an optimization which should be done for others as well
    if (typeof this.$t !== 'function') this.$t = text => text // if no internationalization
  },
  computed: {
    showTitle () { return this.title || '' }
  },
  watch: {
    pagination: async function (newValue, oldValue) {
      console.log('watch - pagination')
      await this.getRecords({ mode: 'pagesort' })
    }
  },
  methods: {
    goBack () { this.$router.back() }, // return from child
    // mode - (user action): created, deleted, filter-paged, filter-infinite
    //      - (page, sort events & initial load): pagesort, load-more (for subsequent infinite scroll loads)
    async getRecords ({ mode }) {
      // VARIATION Start - Vuetify2
      if (this.infinite) {
        if (mode === 'load-more') this.pagination.page = this.cursor // load more, this does not fire pagination event
        else if (mode === 'filter-infinite' || mode === 'created' || mode === 'deleted') this.pagination.page = this.pageDefaults.start
        else if (mode === 'pagesort' && this.pagination.page === this.pageDefaults.start) {
          // console.log('ok')
        } else return
      }
      let filters = {}
      for (let key in this.filters) {
        let value = this.filters[key].value
        if (value) filters[key] = value
      }
      let sorters = ''
      const { sortBy = [], sortDesc = [] } = this.pagination
      for (let index in sortBy) {
        if (sortDesc[index] !== undefined) {
          if (sorters) sorters += ';'
          sorters += `${sortBy[index]},${sortDesc[index] ? 'desc' : 'asc'}`
        }
      }
      // VARIATION End - Vuetify2
      const payload = {
        parentId: this.parentId,
        pagination: this.pagination,
        filters,
        sorters
      }
      this.loading = true
      // console.log('getRecords', mode, this.pagination, filters, sorters)
      const { status = 500, data = null, error = null } = await this.crud.find(payload) // pagination returns for infinite scroll
      if (status === 200) {
        let { records, totalRecords = 0, cursor = '' } = data
        this.cursor = cursor

        if (this.infinite && this.pagination.page !== this.pageDefaults.start) {
          this.totalRecords += records.length
          this.records = this.records.concat(records)
        } else {
          this.totalRecords = totalRecords
          this.records = records
        }
      }
      this.notifyFind({ status, error })
      this.loading = false
    },
    async getRecord (id) {
      this.loading = true
      const { status = 500, data = null, error = null } = await this.crud.findOne(id)
      if (status === 200 && data) {
        for (let key in this.form) {
          this.form[key].value = this.form[key].render ? this.form[key].render(data[key]) : data[key]
        }
      }
      this.notifyFindOne({ status, error })
      this.loading = false
    },
    async updateRecord ({ record }) {
      if (!this.confirmUpdate()) return
      this.loading = true
      // eslint-disable-next-line
      const { status = 500, data = null, error = null } = await this.crud.update({ record })
      this.loading = false
      if (status === 200) await this.updated({ data })
      this.notifyUpdate({ status, error })
    },
    async createRecord ({ record, parentId }) {
      if (!this.confirmCreate()) return
      this.loading = true
      // eslint-disable-next-line
      const { status = 500, data = null, error = null } = await this.crud.create({ record, parentId })
      this.loading = false
      if (status === 201) await this.created({ data })
      this.notifyCreate({ status, error })
    },
    async deleteRecord (id) {
      if (!this.confirmDelete()) return
      this.loading = true
      // eslint-disable-next-line
      const { status = 500, data = null, error = null } = await this.crud.delete(id)
      if (status === 200) await this.deleted(id)
      this.loading = false
      this.notifyDelete({ status, error })
    },
    async exportRecords () {
      this.loading = true
      // VARIATION Start - Vuetify2
      let filters = {}
      for (let key in this.filters) {
        let value = this.filters[key].value
        if (value) filters[key] = value
      }
      // VARIATION End - Vuetify2
      const payload = {
        parentId: this.parentId,
        pagination: this.pagination, // not used
        filters,
        sorters: ''
      }
      this.loading = true
      const { status = 500, error = null } = await this.crud.export(payload)
      this.notifyExport({ status, error })
      this.loading = false
    },
    formClose () {
      this.showForm = false
      this.$emit('form-close')
    },
    async formOpen (id) {
      this.selectedId = id
      if (id) {
        await this.getRecord(id) // update
      } else { // create - set initial data
        this.editingRow = null
        for (let key in this.form) this.form[key].value = this.$attrs.form[key].default || ''
      }
      this.showForm = true
      this.$emit('form-open', this.form)
    },
    async formSave (e) {
      let record = {}
      let id = this.selectedId
      for (let key in this.form) {
        if (key !== this.idName) record[key] = this.form[key].value // ignore id, get from selectedId
      }
      record[this.idName] = id
      if (id) await this.updateRecord({ record })
      else await this.createRecord({ record, parentId: this.parentId })
      this.formClose()
    },
    async formDelete (e) {
      const id = this.selectedId
      if (id) await this.deleteRecord(id)
      this.formClose()
    },

    async onFilter () {
      if (this.editingRow) this.editingRow = null
      this.totalRecords = 0
      this.records = []
      if (this.infinite) {
        // VARIATION Start Vuetify2
        // NO NEED... IT IS ALREADY DONE this.pagination.page = this.pageDefaults.start // this does not fire off pagination event
        await this.getRecords({ mode: 'filter-infinite' }) // so need to call this after
        // VARIATION End Vuetify2
      } else {
        // VARIATION Start Vuetify2
        if (this.pagination.page !== this.pageDefaults.start) {
          this.pagination = { // this fire off pagination event
            ...this.pagination,
            page: this.pageDefaults.start
          }
        } else {
          await this.getRecords({ mode: 'filter-paged' })
        }
        // VARIATION End Vuetify2
      }
    },
    async onExport () { await this.exportRecords() },
    // clearFilter () { this.$refs.searchForm.reset() }, // can do test code here too

    // INLINE EDIT START
    _isRowEditing (item) { return (!this.editingRow) ? false : item[this.idName] === this.editingRow[this.idName] },
    async _inlineSave (item) {
      item = { ...this.editingRow }
      this.editingRow = null
      await this.updateRecord({ record: item })
    },
    async _inlineCreate () {
      this.editingRow = null
      await this.createRecord({ record: {}, parentId: this.parentId })
    },
    // INLINE EDIT END
    _isHidden (hidden) { return (hidden === 'add' && !this.selectedId) || (hidden === 'edit' && !!this.selectedId) || hidden === 'all' },
    _isReadOnly (readonly) { return (readonly === 'add' && !this.selectedId) || (readonly === 'edit' && !!this.selectedId) || readonly === 'all' },
    _isObject (obj) { return obj !== null && typeof obj === 'object' },
    async testFunction (_in) { } // for testing anything
  }
}
</script>

<template>
  <div v-if="ready">
    <!-- progress overlay -->
    <slot name="progress" :vcx="_self">
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </slot>
    <!-- filter & table -->
    <component :is="'div'" v-show="!showForm">
      <slot name="table-toolbar" :vcx="_self">
        <v-toolbar v-bind="vtoolbar">
          <v-toolbar-title><v-btn v-if="parentId" v-bind="vbtn.back.props" @click.stop="goBack" :disabled="loading"><v-icon>{{vbtn.back.icon}}</v-icon><span>{{vbtn.back.label}}</span></v-btn> {{ showTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="filters" v-bind="vbtn.filter.props" @click="showFilter=!showFilter"><v-icon>{{ showFilter ? vbtn.filter.icon2 : vbtn.filter.icon }}</v-icon><span>{{vbtn.filter.label}}</span></v-btn>
          <v-btn v-bind="vbtn.reload.props" @click="onFilter" :disabled="!validFilter || loading"><v-icon>{{vbtn.reload.icon}}</v-icon><span>{{vbtn.reload.label}}</span></v-btn>
          <v-btn v-if="crud.create" v-bind="vbtn.create.props" @click.stop="inline.create?_inlineCreate():formOpen(null)" :disabled="loading"><v-icon>{{vbtn.create.icon}}</v-icon><span>{{vbtn.create.label}}</span></v-btn>
          <v-btn v-if="crud.export" v-bind="vbtn.export.props" @click.stop.prevent="onExport" :disabled="loading"><v-icon>{{vbtn.export.icon}}</v-icon><span>{{vbtn.export.label}}</span></v-btn>
        </v-toolbar>
      </slot>
      <div v-if="showFilter">
        <slot name="filter" :filters="filters" :parentId="parentId" :vcx="_self">
          <v-form v-if="filters" v-model="validFilter" ref="searchForm" v-bind="vformFilter">
            <v-container fluid>
              <v-layout row wrap>
                <template v-for="(filter, i) in filters">
                  <v-flex :key="i" v-bind="filter['field-wrapper']">
                    <component :is="filter.type" v-model="filter.value" v-bind="filter['field-input']" />
                  </v-flex>
                </template>
              </v-layout>
            </v-container>
          </v-form>
        </slot>
      </div>
      <slot name="table" :records="records" :totalRecords="totalRecords" :pagination="pagination" :vcx="_self">
        <v-data-table
          :headers="vtable.headers"
          :items="records"
          :server-items-length="totalRecords"
          :options.sync="pagination"
          :hide-default-footer="infinite"
          v-bind="vtable"
          :item-key="idName"
        >
          <template v-slot:headerCell="props">
            <span v-html="props.header.text"></span>
          </template>
          <!-- <template v-slot:item.data-table-select="{ on, props }">
            <v-simple-checkbox color="green" v-bind="props" v-on="on"></v-simple-checkbox>
          </template> -->
          <template v-slot:item="{ item }">
            <tr :key="item[idName]" :ref="`row-${item[idName]}`" @click.stop="onRowClick(item, $event, _self)">
              <slot name="td" :headers="vtable.headers" :item="item" :vcx="_self">
                <td :key="header.value + index" v-for="(header, index) in vtable.headers" :class="header.class">
                  <span v-if="header.action">
                    <template v-if="_isRowEditing(item)">
                      <v-icon v-if="crud.update && inline.update" v-bind="vicon.save.props" @click.stop="_inlineSave(item)" :disabled="loading">{{vicon.save.name}}</v-icon>
                      <v-icon v-if="crud.update && inline.update" v-bind="vicon.cancel.props" @click.stop="editingRow=null" :disabled="loading">{{vicon.cancel.name}}</v-icon>
                    </template>
                    <template v-else>
                      <v-icon v-if="crud.update && (inline.update || (!inline.update && form))" v-bind="vicon.edit.props" @click.stop="inline.update?editingRow = { ...item }:formOpen(item[idName])" :disabled="loading">{{vicon.edit.name}}</v-icon>
                      <v-icon v-if="crud.delete && inline.delete" v-bind="vicon.delete.props" @click.stop="deleteRecord(item[idName])" :disabled="loading">{{vicon.delete.name}}</v-icon>
                    </template>
                  </span>
                  <template v-else>
                    <component v-if="inline.update && _isRowEditing(item) && header.edit" :is="header.edit.type" v-bind="header.edit.props" :key="item[idName]+'-'+item[header.value]" v-model="editingRow[header.value]"></component>
                    <span v-else v-html="header.render?header.render(item[header.value] || item):item[header.value]"></span>
                  </template>
                </td>
              </slot>
            </tr>
          </template>
          <!-- infinite scroll handling -->
          <template v-if="infinite" v-slot:footer="">
            <div v-bind="vbtn.more.wrapper">
              <v-btn v-if="cursor" @click="getRecords({ mode: 'load-more' })" :disabled="loading" v-bind="vbtn.more.props">{{$t?$t('vueCrudX.more'):vbtn.more.label}}</v-btn>
            </div>
          </template>
          <!-- no data display -->
          <template v-slot:no-data>
            <v-alert :value="!loading&&!records.length" color="error" icon="warning">{{$t?$t('vueCrudX.noData'):'NO DATA'}}</v-alert>
          </template>
        </v-data-table>
      </slot>
    </component>
    <!-- form use v-if instead of v-show to refresh -->
    <component :is="'div'" v-if="showForm" row justify-center>
      <slot name="form-toolbar" :vcx="_self">
        <v-toolbar v-bind="vtoolbar">
          <v-toolbar-title><v-btn v-bind="vbtn.close.props" @click.native="formClose" :disabled="loading"><v-icon>{{vbtn.close.icon}}</v-icon><span>{{vbtn.close.label}}</span></v-btn> {{showTitle}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-bind="vbtn.delete.props" v-if="crud.delete && selectedId" @click.native="formDelete" :disabled="loading"><v-icon>{{vbtn.delete.icon}}</v-icon><span>{{vbtn.delete.label}}</span></v-btn>
          <v-btn v-bind="vbtn.update.props" v-if="crud.update && selectedId||crud.create && !selectedId" :disabled="!validForm||loading" @click.native="formSave"><v-icon>{{vbtn.update.icon}}</v-icon><span>{{vbtn.update.label}}</span></v-btn>
        </v-toolbar>
      </slot>
      <slot name="form" :form="form" :parentId="parentId" :vcx="_self">
        <v-form v-model="validForm" v-bind="vformCrud"  :parentId="parentId" :vcx="_self">
          <v-container fluid>
            <v-layout row wrap>
              <template v-for="(item, i) in form">
                <v-flex :key="i" v-if="!_isHidden(item.hidden)" v-bind="item['field-wrapper']">
                  <component :is="item.type" v-model="item.value" v-bind="item['field-input']" :disabled="_isReadOnly(item.readonly)"/>
                </v-flex>
              </template>
            </v-layout>
          </v-container>
        </v-form>
      </slot>
    </component>
  </div>
</template>

<style scoped>
</style>
