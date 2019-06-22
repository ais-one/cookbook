<script>
// Notes:
// IMPORTANT - important point to take not of
// TBD - to be done
// TOREMOVE - to be removed
// TODEPRECATE - to deprecate & remove

import _cloneDeep from 'lodash.clonedeep'

/*
const v2 = {
  id: 'id', // the id field name usually  'id', for mongo its '_id',
  refetch: false, // do refetch after C U D?
  optimistic: true, // optimistic UI

  // operations
  find: null,
  findOne: null,
  update: null,
  create: null,
  remove: null,
  export: null,
  ws: null, // websocket operation?

  parentId: null
}
*/

export default {
  props: {
    parentId: { type: String, default: null },

    // v1
    crudFilter: { type: Object, required: false },
    crudTable: { type: Object, required: true },
    crudForm: { type: Object, required: true },
    crudOps: { type: Object, required: true }
  },
  data () {
    return {
      ready: false,
      pagination: {
        descending: false,
        page: 1,
        itemsPerPage: 20,
        sortBy: [],
        totalItems: 0 // completely useless at the moment
      },
      paginationRefresh: true,
      records: [], // get many - filter, page & sort
      totalRecords: 0,
      record: {}, // selected record
      defaultRec: {},
      canUpdate: false, // permissions
      canCreate: false,
      canDelete: false,
      formReload: true, // refetch after create, update or delete

      // form
      crudFormFlag: false,
      validForm: true,
      onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
      onRowClickOpenForm: true, // set to false of you do not want row click to open form
      hasFormVue: false,
      formAutoData: null, // if present autogenerate form

      // filter
      validFilter: true,

      // data-table
      loading: false,
      editing: null, // inline edit in progress, start time Date.now(), 0 means not editing
      inlineValue: null, // temporarily storing inline  edit values

      // crudTable
      headers: [ ], // pass in

      inline: false, // inline editing
      saveRow: false, // otherwise it is the color string
      inlineReload: { // set to false for services where record read is chargeable, e.g. Google Firestore (use listeners instead)
        create: true,
        update: true,
        delete: true
      },
      actionColumn: false,
      addrowCreate: false, // add row to create instead of using form

      confirmCreate: false, // confirmation required flags
      confirmUpdate: false,
      confirmDelete: true,
      doPage: true, // pagination, false === no pagination, otherwise initial itemsPerPage
      crudTitle: '', // title
      showGoBack: false,

      // supported controls
      selectControls: ['v-autocomplete', 'v-switch', 'v-select', 'v-combobox', 'v-checkbox'],
      groupControls: ['v-btn-toggle', 'v-radio-group'], // need to check if iteration is common? if not need to find a way to handle it, v-radio-group is different

      // styling
      attrs: {
        // you can add attributes used by the component and customize style and classes
        container: { // v-container Component
          fluid: true,
          class: 'pa-2', // parentId ? 'make-modal' : ''
          style: { }
        },
        dialog: { // v-dialog Component
          fullscreen: false,
          scrollable: true,
          transition: 'dialog-bottom-transition',
          overlay: false
        },
        form: { // v-form Component
          class: 'grey lighten-3 pa-2',
          style: {
            overflow: 'auto'
          },
          'lazy-validation': true
        },
        alert: { // v-alert Component
          color: 'grey',
          icon: ''
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
          'loading-color': 'primary',
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
        'v-progress-linear': { // v-progress-linear, can also be v-progress-circular
          class: 'ma-0'
        },
        'edit-indicator-left': '', // ️'🖊️'
        'edit-indicator-right': '',
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
      // show/hide
      showFilterButton: true, // should the filter button be shown?
      expandFilter: false,

      // V2
      filters: null
    }
  },
  async created () {
    this.ready = false
    // TODEPRECATE - remove crudFilter, convert as object to array
    this.filters = (this.crudFilter && this.crudFilter.filterData) ? this.crudFilter.filterData : this.$attrs.filters || null // Set initial filter data here
    // this.pagination // TBD set initial pagination data here
    if (this.crudTable.doPage === false) {
      this.doPage = false // if not set
      this.paginationRefresh = false
      this.pagination.itemsPerPage = -1
    } else {
      this.doPage = isNaN(parseInt(this.crudTable.doPage)) ? 20 : parseInt(this.crudTable.doPage)
      this.paginationRefresh = false
      this.pagination.itemsPerPage = this.doPage
    }
  },
  async mounted () {
    console.log('Translation!!!', this.$t)
    this.paginationRefresh = !!this.$scopedSlots['table']
    this.$options.filters.formatters = this.crudTable.formatters // create the formatters programatically
    if (this.crudTable.inline) this.inline = this.crudTable.inline // set inline edit fields
    this.headers = this.crudTable.headers
    this.actionColumn = this.headers.findIndex(header => header.value === '') !== -1
    this.saveRow = this.crudTable.saveRow ? this.crudTable.saveRow : false // save by row? default false
    this.inlineReload = Object.assign(this.inlineReload, this.crudTable.inlineReload || {}) // default true

    this.formReload = this.crudTable.formReload !== false // default true
    this.formAutoData = (this.isObject(this.crudForm.formAutoData)) ? this.crudForm.formAutoData : null // check if components and datas are present

    this.addrowCreate = this.crudTable.addrowCreate ? this.crudTable.addrowCreate : false // use add row to create record
    this.onRowClickOpenForm = this.crudTable.onRowClickOpenForm !== false // open form on row click? default true

    // set confirmation
    this.confirmCreate = this.crudTable.confirmCreate === true // default false
    this.confirmUpdate = this.crudTable.confirmUpdate === true // default false
    this.confirmDelete = this.crudTable.confirmDelete !== false // default true

    this.crudTitle = this.crudTable.crudTitle || '' // title
    this.showGoBack = this.crudTable.showGoBack !== false // hide go back button - default true
    this.onCreatedOpenForm = this.crudTable.onCreatedOpenForm === true // open form on create - default false
    this.showFilterButton = this.crudTable.showFilterButton !== false // show filter button - default true

    // more attributes
    this.attrs = Object.assign(this.attrs, this.crudTable.attrs || {})
    this.buttons = Object.assign(this.buttons, this.crudTable.buttons || {})

    if (this.onCreatedOpenForm && this.record.id /* Not Needed? && !this.parentId */) { // nested CRUD, when coming back to a parent open a form
      this.crudFormFlag = true
    }

    // not needed in data() because it does not exist in template, an optimization which should be done for others as well
    if (typeof this.$t !== 'function') { // if no internationalization
      this.$t = text => text
    }
    // for (let key in this.filters) { // type to field - TOREMOVE, populated in parent
    //   if (this.filters[key].attrs && this.filters[key].itemsFn) this.filters[key].attrs.items = await this.filters[key].itemsFn()
    // }
    this.canUpdate = this.crudOps.update && (this.hasFormVue || this.formAutoData)
    this.canCreate = this.crudOps.create && (this.addrowCreate || this.hasFormVue || this.formAutoData)
    this.canDelete = this.crudOps.delete
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
      handler (value, oval) {
        // console.log('watch pagination', value, oval, this.paginationRefresh, this.doPage)
        if (this.paginationRefresh === false) {
          this.paginationRefresh = true
        } else {
          this.getRecordsHelper()
        }
      },
      deep: true
    },
    parentId (value) {
      // console.log('watch parentId', value)
      this.getRecordsHelper()
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
    async getRecord (payload) {
      this.loading = true
      let record = await this.crudOps.findOne(payload)
      this.setRecord(record)
      this.loading = false
    },
    setRecord (payload) {
      if (!payload) this.record = (typeof this.crudForm.defaultRec === 'function') ? this.crudForm.defaultRec() : _cloneDeep(this.defaultRec)
      else this.record = _cloneDeep(payload)
    }, // NOTE: mutated here without dispatching action
    async exportRecords (payload) {
      await this.crudOps.export(payload)
    },
    closeCrudForm () {
      this.setRecord() // clear it
      this.crudFormFlag = false
      this.$emit('form-close')
    },
    async crudFormOpen (id) {
      if (id) await this.getRecord({ id }) // edit
      else this.setRecord() // add
      this.crudFormFlag = true
      this.$emit('form-open', this.record)
    },
    async crudFormSave (e) {
      if (!this.record.id && this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      if (this.record.id && this.confirmUpdate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      if (this.record.id) await this.updateRecord({ record: this.record })
      else await this.createRecord({ record: this.record, parentId: this.parentId })
      if (this.formReload) await this.getRecordsHelper()
      this.closeCrudForm()
    },
    async crudFormDelete (e) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      const { id } = this.record
      if (id) {
        await this.deleteRecord({ id })
        if (this.formReload) await this.getRecordsHelper()
      }
      this.closeCrudForm()
    },
    async getRecordsHelper () {
      this.loading = true
      // emit filter update event
      const payload = {
        user: this.$store.getters.user,
        doPage: this.doPage,
        pagination: this.pagination,
        filters: this.filters,
        parentId: this.parentId
      }
      let { records, totalRecords } = await this.crudOps.find(payload) // pagination no need to return
      this.totalRecords = !totalRecords ? records.length : totalRecords
      this.records = records
      // emit pagination update event
      this.loading = false
    },
    async submitFilter () {
      if (this.saveRow) {
        this.clearEditing()
      }
      await this.getRecordsHelper()
      this.$emit('loaded', Date.now())
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
    isEditing (row) { // check if a row is editing
      if (row) {
        if (this.editing && this.editing[row]) return true
        else return false
      } else { // check if entire table is editing
        return this.editing
      }
    },
    setEditing (row, item) {
      this.$refs[`edit-${row}`].style['background-color'] = this.saveRow
      if (this.editing === null) this.editing = {}
      this.editing[row] = { item, ts: Date.now() }
      // console.log('set', this.editing)
    },
    clearEditing (row) {
      // console.log('clear', this.editing, row)
      if (row !== undefined) {
        if (this.editing && this.editing[row]) {
          this.$refs[`edit-${row}`].style['background-color'] = ''
          delete this.editing[row]
          if (Object.keys(this.editing).length === 0) this.editing = null
        }
      } else {
        for (let i = 0; i < this.records.length; i++) this.$refs[`edit-${i}`].style['background-color'] = ''
        this.editing = null
      }
    },
    // inline edit
    inlineOpen (value, row, col) {
      this.inlineValue = value
      if (row !== undefined && col !== undefined) {
        const ref = this.$refs[`edit-${row}-${col}`][0]
        this.$nextTick(() => {
          const component = ref.$children[0].$children[0].$children[0]
          const tag = component.$options._componentTag
          if (tag === 'v-textarea') {
            // component.focus()
            // this.$nextTick(() => component.focus())
            // this.$forceUpdate()
            setTimeout(() => component.focus(), 50) // only this works
          }
        })
      }
    },
    async inlineClose (item, field, row, col) {
      if (!field || item[field] !== this.inlineValue) { // field undefined means saveRow button clicked
        if (field && this.saveRow) { // cell changed
          this.setEditing(row, item)
        }
      }
    },
    async inlineUpdate (item, field, row, col) {
      if (!field || item[field] !== this.inlineValue) { // field undefined means saveRow button clicked
        if (field && this.saveRow) { // cell changed
          this.setEditing(row, item)
        } else {
          if (this.saveRow && !this.isEditing(row)) return
          // console.log('inlineUpdate Save!', row, item)
          const rv = await this.updateRecord({ record: item })
          if (!rv) { // error
            // console.log('inlineUpdate Save Error!')
            if (!this.saveRow) item[field] = this.inlineValue // if false undo changes
          } else { // success
            if (this.saveRow) this.clearEditing(row)
            if (this.inlineReload.update) this.$nextTick(async function () { await this.getRecordsHelper() })
          }
        }
      } // else console.log('no changes')
      if (row !== undefined && col !== undefined) { // datepicker / timepicker for now
        const ref = this.$refs[`edit-${row}-${col}`] && this.$refs[`edit-${row}-${col}`][0] ? this.$refs[`edit-${row}-${col}`][0] : null
        if (ref) {
          let vEditDialogInput = null
          try {
            vEditDialogInput = ref.$children[0].$children[0].$children[0]
          } catch (e) { }
          if (vEditDialogInput) {
            const tag = vEditDialogInput.$options._componentTag
            if (tag === 'v-date-picker' || tag === 'v-time-picker' || tag === 'v-textarea') ref.save(item[field]) // = false
          }
        }
      }
    },
    async inlineCancel (row, col) { // UNUSED...
      if (row !== undefined && col !== undefined) { // datepicker / timepicker for now
        const ref = this.$refs[`edit-${row}-${col}`][0]
        ref.cancel()
      }
    },
    async inlineCreate () {
      let record = (typeof this.crudForm.defaultRec === 'function') ? this.crudForm.defaultRec() : _cloneDeep(this.crudForm.defaultRec)
      if (this.saveRow) {
        if (this.isEditing()) return alert(this.$t('vueCrudX.pleaseSave'))
      }
      for (let i = 0; i < this.addrowCreate.length; i++) {
        const { field, label } = this.addrowCreate[i]
        const val = prompt(label, record[field])
        if (val) record[field] = val
        else return
      }
      if (this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.createRecord({ record, parentId: this.parentId })
      // add
      if (this.inlineReload.create) this.$nextTick(async function () { await this.getRecordsHelper() })
    },
    async inlineDelete (id) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.deleteRecord({ id })
      // find index & delete
      if (this.inlineReload.delete) this.$nextTick(async function () { await this.getRecordsHelper() })
    },
    // rowClicked (item, event, row) {
    rowClicked (a, b) {
      console.log('v2', 'rowClicked', a, b)
      // if (!this.actionColumn && this.onRowClickOpenForm) this.crudFormOpen(item.id) // no action column && row click opens form
      // if (!this.inline) {
      //   this.$emit('selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
      // }
    },
    async testFunction (_in) { // for testing anything
      console.log(_in)
    }
  }
}
</script>

<template>
  <v-container v-if="ready" v-bind="attrs.container">
    <slot name="table-toolbar" :vcx="_self">
      <v-toolbar v-bind="attrs.toolbar">
        <v-toolbar-title><v-btn v-if="parentId && showGoBack" v-bind="attrs.button" @click.stop="goBack" :disabled="loading"><v-icon>{{buttons.back.icon}}</v-icon><span>{{buttons.back.label}}</span></v-btn> {{ showTitle }} {{ doPage ? '' : ` (${records.length})` }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="showFilterButton" v-bind="attrs.button" @click="expandFilter=!expandFilter" :disabled="!filters"><v-icon>{{ expandFilter ? buttons.filter.icon2 : buttons.filter.icon }}</v-icon><span>{{buttons.filter.label}}</span></v-btn>
        <v-btn v-bind="attrs.button" @click="submitFilter" :disabled="!validFilter || loading"><v-icon>{{buttons.reload.icon}}</v-icon><span>{{buttons.reload.label}}</span></v-btn>
        <v-btn v-if="canCreate" v-bind="attrs.button" @click.stop="addrowCreate?inlineCreate():crudFormOpen(null)" :disabled="loading"><v-icon>{{buttons.create.icon}}</v-icon><span>{{buttons.create.label}}</span></v-btn>
        <v-btn v-if="crudOps.export" v-bind="attrs.button" @click.stop.prevent="exportBtnClick" :disabled="loading"><v-icon>{{buttons.export.icon}}</v-icon><span>{{buttons.export.label}}</span></v-btn>
      </v-toolbar>
    </slot>
    <div v-if="expandFilter">
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
        :loading="loading?attrs.table['loading-color']:false"
        :hide-default-footer="!doPage"
        v-bind="attrs.table"
        fixed-header
      >
        <template v-slot:headerCell="props">
          <span v-html="props.header.text"></span>
        </template>
        <template v-slot:items="props">
          <tr :ref="`edit-${props.index}`" @click.stop="rowClicked(props.item, $event, props.index)">
            <td :key="header.value" v-for="(header, index) in headers" :class="header['cell-class']?header['cell-class']:header.class">
              <span v-if="header.value===''">
                <v-icon v-if="canUpdate&&!saveRow" v-bind="attrs['action-icon']" @click.stop="crudFormOpen(props.item.id)" :disabled="loading">edit</v-icon>
                <v-icon v-if="canDelete" v-bind="attrs['action-icon']" @click.stop="inlineDelete(props.item.id)" :disabled="loading">delete</v-icon>
                <v-icon v-if="crudOps.update&&saveRow" v-bind="attrs['action-icon']" @click.stop="inlineUpdate(props.item, null, props.index, index)" :disabled="loading">save</v-icon>
              </span>
              <span v-else-if="!inline[header.value]" v-html="$options.filters.formatters(props.item[header.value], header.value)"></span>
              <v-edit-dialog
                v-else-if="inline[header.value].field==='v-date-picker'||inline[header.value].field==='v-time-picker'||inline[header.value].field==='v-textarea'"
                :ref="`edit-${props.index}-${index}`"
                :return-value.sync="props.item[header.value]"
                :large="inline[header.value].buttons"
                :persistent="false"
                :cancel-text="$t('vueCrudX.cancel')"
                :save-text="$t('vueCrudX.save')"
                lazy
                @save="saveRow?'':inlineUpdate(props.item, header.value, props.index, index)"
                @cancel="()=>{}"
                @open="inlineOpen(props.item[header.value], props.index, index)"
                @close="()=>{}"
              >
                <div>{{attrs['edit-indicator-left']}}{{ props.item[header.value] }}{{attrs['edit-indicator-right']}}</div>
                <!-- new Date('2018-11-30').toLocaleDateString('en-GB', { month: "short", day: "numeric" }) -->
                <component
                  :is="inline[header.value].field"
                  slot="input"
                  @input="inline[header.value].field!=='v-textarea'?inlineUpdate(props.item, header.value, props.index, index):''"
                  @blur="inline[header.value].field==='v-textarea'?inlineUpdate(props.item, header.value, props.index, index):inlineClose(props.item, header.value, props.index, index)"
                  v-model="props.item[header.value]"
                  v-bind="inline[header.value].attrs"
                ></component>
              </v-edit-dialog>
              <component
                v-else-if="groupControls.indexOf(inline[header.value].field)!==-1"
                :ref="`edit-${props.index}-${index}`"
                :is="inline[header.value].field"
                v-bind="inline[header.value].attrs"
                v-model="props.item[header.value]"
                @change="inlineUpdate(props.item, header.value, props.index, index)"
              >
                <template v-if="inline[header.value].field==='v-btn-toggle'">
                  <component :is="'v-btn'" v-for="(value, key, index) in inline[header.value].group.items" :key="index" :value="key" :label="value" v-bind="inline[header.value].group.attrs"></component>
                </template>
                <template v-else-if="inline[header.value].field==='v-radio-group'">
                  <component :is="'v-radio'" v-for="(value, key, index) in inline[header.value].group.items" :key="index" :value="key" :label="value" v-bind="inline[header.value].group.attrs"></component>
                </template>
              </component>
              <component
                v-else
                :ref="`edit-${props.index}-${index}`"
                :is="inline[header.value].field"
                v-bind="inline[header.value].attrs"
                v-model="props.item[header.value]"
                @focus="inlineOpen(props.item[header.value])"
                @blur="selectControls.indexOf(inline[header.value].field)===-1?inlineUpdate(props.item, header.value, props.index, index):''"
                @change="selectControls.indexOf(inline[header.value].field)!==-1?inlineUpdate(props.item, header.value, props.index, index):''"
              ></component>
            </td>
          </tr>
        </template>
        <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">{{$t?$t('vueCrudX.noData'):'NO DATA'}}</v-alert>
        </template>
      </v-data-table>
    </slot>

    <slot name="summary" :vcx="_self"></slot>

    <v-layout row justify-center>
      <v-dialog v-model="crudFormFlag" v-bind="attrs.dialog">
        <v-card>
          <slot name="form-toolbar" :vcx="_self">
            <v-toolbar v-bind="attrs.toolbar">
              <v-toolbar-title><v-btn v-bind="attrs.button" @click.native="closeCrudForm" :disabled="loading"><v-icon>{{buttons.close.icon}}</v-icon><span>{{buttons.close.label}}</span></v-btn> {{showTitle}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn v-bind="attrs.button" v-if="canDelete && record.id" @click.native="crudFormDelete" :disabled="loading"><v-icon>{{buttons.delete.icon}}</v-icon><span>{{buttons.delete.label}}</span></v-btn>
                <v-btn v-bind="attrs.button" v-if="canUpdate && record.id||canCreate && !record.id" :disabled="!validForm||loading" @click.native="crudFormSave"><v-icon>{{buttons.update.icon}}</v-icon><span>{{buttons.update.label}}</span></v-btn>
              </v-toolbar-items>
            </v-toolbar>
          </slot>
          <component :is="attrs['v-progress-circular']?'v-progress-circular':'v-progress-linear'" :indeterminate="loading" v-bind="attrs['v-progress-circular']?attrs['v-progress-circular']:attrs['v-progress-linear']"></component>
          <slot name="form" :record="record" :parentId="parentId" :vcx="_self">
            <v-form v-if="hasFormVue" v-model="validForm" v-bind="attrs.form">
              <v-layout row wrap>
                <v-flex v-for="(form, objKey, index) in formAutoData" :key="index" :sm6="form.halfSize" xs12>
                  <component v-if="form.field==='hidden'" :is="'div'"></component>
                  <component v-else-if="record[objKey]!==undefined" :is="form.field" v-model="record[objKey]" v-bind="form.attrs">
                    <template v-if="form.field==='v-btn-toggle'">
                      <component :is="'v-btn'" v-for="(value, key, index) in form.group.items" :key="index" :value="key" v-bind="form.group.attrs">{{ value }}</component>
                    </template>
                    <template v-else-if="form.field==='v-radio-group'">
                      <component :is="'v-radio'" v-for="(value, key, index) in form.group.items" :key="index" :value="key" :label="value" v-bind="form.group.attrs"></component>
                    </template>
                  </component>
                </v-flex>
              </v-layout>
            </v-form>
          </slot>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<style lang="css" scoped>
/* should no longer need to make nested table a modal */
.make-modal {
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 0;
  min-width: 100%;
  min-height: 100%;
  background-color: #fff;
}
/* fixed-header - not working yet
https://github.com/vuetifyjs/vuetify/issues/1547#issuecomment-418698573
*/
</style>
