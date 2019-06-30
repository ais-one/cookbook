<script>
// Notes:
// VARIATION - Note this code block when implementing on other UI Framework
// IMPORTANT - important point to take not of
// TOREMOVE - to be removed
// TODEPRECATE - to deprecate & remove
// UNUSED - not used

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

      // show/hide
      showFilterButton: true, // should the filter button be shown?

      showFilter: false,
      showForm: false,

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
        container: { fluid: true, class: 'pa-2', style: { } }, // v-container Component
        form: { // v-form Component
          class: 'grey lighten-3 pa-2',
          style: {
            overflow: 'auto'
          },
          'lazy-validation': true
        },
        toolbar: { height: 48, dark: false, light: true, color: 'grey', fixed: false }, // v-toolbar Component
        button: { dark: false, light: true, icon: true, fab: false }, // v-btn Component
        'action-icon': { small: true, class: 'mr-1' } // for the action column
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
      infinite: false, // either paged or infinite scroll
      editingRow: null, // or row object

      // depends on UI Framework
      pagination: {
        // VARIATION - Start Vuetify2
        page: 1,
        itemsPerPage: 2,
        sortBy: [],
        sortDesc: [],
        totalItems: 0 // completely useless at the moment
        // VARIATION - End Vuetify2
      },
      pageOpts: { // infinite scroll
        infinite: false,
        start: 1,
        itemsPerPage: 2,
        sortBy: [],
        sortDesc: []
      },
      cursor: '', // infinite scroll cursor

      table: {
        // VARIATION - Start Vuetify2
        dense: true,
        'multi-sort': false,
        'fixed-header': true,
        dark: false,
        light: true,
        'footer-props': {
          'items-per-page-options': [2, 5, 10, 25]
        },
        // 'rows-per-page-items': [],
        'hide-default-header': false,
        style: { // this may need to be changed once Vuetify version 2.0 is out
          'max-height': 'calc(100vh - 144px)',
          // 'overflow-y': 'scroll',
          'backface-visibility': 'hidden'
        }
        // VARIATION - End Vuetify2
      },

      sorters: {
        // VARIATION - Start Vuetify 2
        // Not Used In Vuetify
        // VARIATION - End Vuetify 2
      },

      // V2
      idName: 'id',
      inline: { // inline functionality
        create: false, update: false, delete: false
      },
      filters: null,
      form: null,
      selectedId: null
    }
  },
  async created () {
    this.ready = false

    // VARIATION Start Vuetify2
    this.table = Object.assign(this.table, this.$attrs.table || {})
    this.sorters = Object.assign(this.sorters, this.$attrs.sorters || {})
    this.pageOpts = Object.assign(this.pageOpts, this.$attrs.pageOpts || {})
    this.pagination = {
      ...this.pagination,
      page: this.pageOpts.start,
      itemsPerPage: this.pageOpts.itemsPerPage,
      sortBy: this.pageOpts.sortBy,
      sortDesc: this.pageOpts.sortDesc
    }
    if (this.pageOpts.infinite) this.cursor = this.pageOpts.start
    // VARIATION End Vuetify2
    this.filters = this.$attrs.filters || null
    this.inline = Object.assign(this.inline, this.$attrs.inline || {})
    this.form = this.$attrs.form || null

    this.idName = this.$attrs.idName || 'id'

    // non-ui reactive data - START
    this.onRowClick = this.$attrs.onRowClick || ((item, event) => { // open form on row click? default true
      if (!this.inline.update) this.formOpen(item[this.idName]) // no action column && row click opens form
      this.$emit('row-selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
    })
    this.updated = this.$attrs.updated || (({ record }) => { // also handles real-time updates
      const idx = this.records.findIndex(rec => rec[this.idName] === record[this.idName])
      if (idx !== -1) {
        for (let key in this.records[idx]) {
          if (key !== this.idName && record[key]) this.records[idx][key] = record[key]
        }
      }
    })
    this.created = this.$attrs.created || (async ({ record }) => { // infinite scroll - case - also handles real-time updates
      if (this.pageOpts.infinite) {
        // ensure that record has the same fields as what is in this.records
        // const idx = this.records.findIndex(rec => rec[this.idName] === id)
        // if (idx !== -1) this.records.splice(idx, 1) this.records.splice(idx, 0, record)
        // // this.records.push(record)
        // // this.records.unshift(record)
        // this.totalRecords += 1
        this._reset()
      } else {
        // always go to page 1
        this._reset()
      }
    })
    this.deleted = this.$attrs.deleted || (async ({ id }) => { // infinite scroll - case - also handles real-time updates
      if (this.pageOpts.infinite) {
        const idx = this.records.findIndex(rec => rec[this.idName] === id)
        if (idx !== -1) this.records.splice(idx, 1)
        this.totalRecords -= 1
      } else {
        const lastPage = Math.ceil(this.totalRecords / this.pagination.itemsPerPage)
        if (this.pagination.page > lastPage) {
          this._reset({ setPage: lastPage })
        }
        await this.getRecords({ mode: 'deleted' })
      }
    })
    // non-ui reactive data - END

    this.headers = this.crudTable.headers
    this.crudTitle = this.crudTable.crudTitle || '' // title
    this.showGoBack = this.crudTable.showGoBack !== false // hide go back button - default true
    this.showFilterButton = this.crudTable.showFilterButton !== false // show filter button - default true

    // set confirmation
    this.confirmCreate = this.crudTable.confirmCreate === true // default false
    this.confirmUpdate = this.crudTable.confirmUpdate === true // default false
    this.confirmDelete = this.crudTable.confirmDelete !== false // default true

    // more attributes
    this.buttons = Object.assign(this.buttons, this.crudTable.buttons || {})

    this.ready = true
  },
  async mounted () {
    // not needed in data() because it does not exist in template, an optimization which should be done for others as well
    if (typeof this.$t !== 'function') this.$t = text => text // if no internationalization
  },
  beforeUpdate () { },
  beforeRouteEnter (to, from, next) { next(vm => { }) },
  computed: {
    showTitle () { return this.crudTitle || 'VueCrudX' }
  },
  // watch: { loading: function (newValue, oldValue) { } }, // UNUSED
  methods: {
    _reset ({ filter = true, sort = true, setPage = false }) { // TBD will trigger a page refresh
      // itemsPerPage
      // page
      // sortBy
      // sortDesc
      // filters
      if (filter) this.filters = this.$attrs.filters || null
      // if no change, fire off getReacords... else
      // this.pagination = {
      //   ...this.pagination,
      //   page: setPage === false ? this.pagination.page : setPage > 0 ? setPage : this.pageOpts.start, // also starting cursor for infinite scroll
      //   itemsPerPage: setPage ? this.pageOpts.limit : this.pagination.itemsPerPage,
      //   sortBy: sort ? this.pageOpts.sortBy : this.pagination.sortBy,
      //   sortDesc: sort ? this.pageOpts.sortDesc : this.pagination.sortDesc
      // }
    },
    goBack () { this.$router.back() }, // return from child

    // mode - (system) - init
    //      - (user action) create, update,  delete, filter-paged, filter-infinite-scroll, null
    //      - (paginator): page, sort-desc, items-per-page
    async getRecords ({ mode }) {
      this.loading = true

      // VARIATION Start - Vuetify2
      if (mode === 'load-more') { // changed via paging
        if (this.pageOpts.infinite) {
          this.pagination.page = this.cursor // load more
        }
      } else if (mode === 'pagination') {
        if (this.pageOpts.infinite) {
          this.pagination.page = this.pageOpts.start // start from beginning
        }
      }
      // VARIATION End - Vuetify2

      // VARIATION Start - Vuetify2
      let filters = {}
      for (let key in this.filters) {
        let value = this.filters[key].value
        if (value) filters[key] = value
      }
      // VARIATION End - Vuetify2

      // VARIATION Start - Vuetify2
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
      console.log('getRecords', mode, this.pagination, filters, sorters)
      const { status = 500, data = null, error = null } = await this.crudOps.find(payload) // pagination returns for infinite scroll
      if (status === 200) {
        let { records, totalRecords = 0, cursor = '' } = data
        this.cursor = cursor

        if (this.pageOpts.infinite && mode === 'load-more') { // infinite scroll
          this.totalRecords += records.length
          this.records = this.records.concat(records)
        } else {
          this.totalRecords = totalRecords
          this.records = records
        }
        // TBD - reset and find?
        // if (totalRecords > 0 && records.length === 0) {
        //   page = Math.ceil(totalRecords / pagination.itemsPerPage) need to reload page...
        // }
      }
      this.$emit('ops-find', { status, error, mode }) // firm up on event
      this.loading = false
    },
    async getRecord ({ id }) {
      this.loading = true
      const { status = 500, data = null, error = null } = await this.crudOps.findOne({ id })
      console.log(status, data, error)
      if (status === 200) {
        for (let key in this.form) {
          this.form[key].value = data[key]
        }
      }
      this.$emit('ops-findone', { status, error }) // firm up on event
      this.loading = false
    },
    async updateRecord ({ record }) {
      this.loading = true
      const { status = 500, data = null, error = null } = await this.crudOps.update({ record })
      this.loading = false
      if (status === 200) {
        await this.updated({ record })
      }
      this.$emit('ops-update', { status, error, data })
    },
    async createRecord ({ record, parentId }) {
      this.loading = true
      const { status = 500, data = null, error = null } = await this.crudOps.create({ record, parentId })
      this.loading = false
      if (status === 201) {
        await this.created({ record: null })
      }
      this.$emit('ops-create', { status, error, data })
    },
    async deleteRecord (id) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      this.loading = true
      const { status = 500, data = null, error = null } = await this.crudOps.delete({ id })
      if (status === 200) {
        await this.deleted({ id })
      }
      this.loading = false
      this.$emit('ops-delete', { status, error, data })
    },
    async exportRecords (payload) {
      const { status = 500, data = null, error = null } = await this.crudOps.export(payload)
      this.$emit('ops-export', { status, error, data })
    },
    formClose () {
      this.showForm = false
      this.$emit('form-close')
    },
    async formOpen (id) {
      this.selectedId = id
      if (id) {
        await this.getRecord({ id }) // update
      } else { // create - set initial data
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
        await this.updateRecord({ record })
      } else {
        await this.createRecord({ record, parentId: this.parentId })
      }
      this.formClose()
    },
    async formDelete (e) {
      const { id } = this.selectedId
      if (id) {
        await this.deleteRecord(id)
      }
      this.formClose()
    },

    async onFilter () {
      if (this.editingRow) this.editingRow = null
      this.totalRecords = 0
      this.records = []
      if (this.pageOpts.infinite) {
        // VARIATION Start Vuetify2
        this.pagination.page = this.pagination.start // this does not fire page reload, because paging footer is hidden not active
        await this.getRecords({ mode: 'filter-infinite-scroll' }) // so need to call this after
        // VARIATION End Vuetify2
      } else {
        console.log('onFilter', this.pagination.page)
        // VARIATION Start Vuetify2
        if (this.pagination.page === 1) {
          await this.getRecords({ mode: 'filter-paged' })
        } else {
          this.pagination.page = this.pageOpts.start // triggers page reload
        }
        // VARIATION End Vuetify2
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
    async onTable () {
      await this.getRecords({ mode: 'pagination' })
    },

    // INLINE EDIT START
    _isRowEditing (item) {
      // console.log('_isRowEditing', this.editingRow, item)
      if (!this.editingRow) return false
      return item[this.idName] === this.editingRow[this.idName]
    },
    async _inlineSave (item) {
      item = { ...this.editingRow }
      this.editingRow = null
      await this.updateRecord({ record: item })
    },
    async _inlineCreate () {
      await this.createRecord({ record: {}, parentId: this.parentId })
    },
    // INLINE EDIT END

    _isHidden (hidden) {
      return (hidden === 'add' && !this.selectedId) || (hidden === 'edit' && this.selectedId) || hidden === 'all'
    },
    _isReadOnly (readonly) {
      return (readonly === 'add' && !this.selectedId) || (readonly === 'edit' && this.selectedId) || readonly === 'all'
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
          <v-btn v-if="crudOps.create" v-bind="attrs.button" @click.stop="inline.create?_inlineCreate():formOpen(null)" :disabled="loading"><v-icon>{{buttons.create.icon}}</v-icon><span>{{buttons.create.label}}</span></v-btn>
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
          :disable-sort="pageOpts.infinite"
        -->
        <v-data-table
          :headers="headers"
          :items="records"
          :server-items-length="totalRecords"
          :options.sync="pagination"
          :hide-default-footer="pageOpts.infinite"
          v-bind="table"
          :item-key="idName"
          @pagination="onTable"
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
            <tr :key="item[idName]" :ref="`row-${item[idName]}`" @click.stop="onRowClick(item, $event)">
              <slot name="td" :headers="headers" :item="item" :vcx="_self">
                <td :key="header.value + index" v-for="(header, index) in headers" :class="header['cell-class']?header['cell-class']:header.class">
                  <span v-if="header.action">
                    <template v-if="_isRowEditing(item)">
                      <v-icon v-if="crudOps.update && inline.update" v-bind="attrs['action-icon']" @click.stop="_inlineSave(item)" :disabled="loading">save</v-icon>
                      <v-icon v-if="crudOps.delete" v-bind="attrs['action-icon']" @click.stop="editingRow=null" :disabled="loading">cancel</v-icon>
                    </template>
                    <template v-else>
                      <v-icon v-if="crudOps.update && (inline.update || (!inline.update && form))" v-bind="attrs['action-icon']" @click.stop="inline.update?editingRow = { ...item }:formOpen(item[idName])" :disabled="loading">edit</v-icon>
                      <v-icon v-if="crudOps.delete && inline.delete" v-bind="attrs['action-icon']" @click.stop="this.deleteRecord(item[idName])" :disabled="loading">delete</v-icon>
                    </template>
                  </span>
                  <template v-else>
                    <component v-if="inline.update && _isRowEditing(item)" :disabled="!header.edit" :is="'v-text-field'" :key="item[idName]+'-'+item[header.value]" v-model="editingRow[header.value]"></component>
                    <span v-else v-html="header.render?header.render(item[header.value]):item[header.value]"></span>
                  </template>
                </td>
              </slot>
            </tr>
          </template>
          <!-- infinite scroll handling -->
          <template v-if="pageOpts.infinite" v-slot:footer="props">
            <v-btn v-if="cursor" @click="getRecords({ mode: 'load-more' })">Load More {{ props.length }}</v-btn>
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
          <v-toolbar-title><v-btn v-bind="attrs.button" @click.native="formClose" :disabled="loading"><v-icon>{{buttons.close.icon}}</v-icon><span>{{buttons.close.label}}</span></v-btn> {{showTitle}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn v-bind="attrs.button" v-if="crudOps.delete && selectedId" @click.native="formDelete" :disabled="loading"><v-icon>{{buttons.delete.icon}}</v-icon><span>{{buttons.delete.label}}</span></v-btn>
            <v-btn v-bind="attrs.button" v-if="crudOps.update && selectedId||crudOps.create && !selectedId" :disabled="!validForm||loading" @click.native="crudFormSave"><v-icon>{{buttons.update.icon}}</v-icon><span>{{buttons.update.label}}</span></v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </slot>
      <slot name="form" :form="form" :parentId="parentId" :vcx="_self">
        <v-form v-model="validForm" v-bind="attrs.form"  :parentId="parentId" :vcx="_self">
          <v-layout row wrap>
            <template v-for="(item, i) in form">
              <v-flex :key="i" v-if="!_isHidden(item.hidden)" v-bind="item['field-wrapper']">
                <component :is="item.type" v-model="item.value" v-bind="item['field-input']" :disabled="_isReadOnly(item.readonly)"/>
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
