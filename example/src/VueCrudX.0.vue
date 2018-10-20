<script>
// Notes:
// IMPORTANT - important point to take not of
// TBD - to be done
// TOREMOVE - to be removed
//

import _cloneDeep from 'lodash.clonedeep'
const CrudStore = {
  namespaced: true,
  // strict: true,
  state: {
    records: [], // get many - filter, page & sort
    totalRecs: 0,
    record: { }, // selected record
    pagination: { },
    filterData: { },
    defaultRec: { },
    crudOps: {
      export: null,
      find: null,
      delete: null,
      findOne: null,
      create: null,
      update: null
    }
  },
  getters: {
    record (state) { return state.record },
    records (state) { return state.records },
    totalRecs (state) { return state.totalRecs },
    filterData (state) { return state.filterData },
    pagination (state) { return state.pagination },
    defaultRec (state) { return state.defaultRec },
    crudOps (state) { return state.crudOps }
  },
  mutations: {
    setRecords (state, payload) {
      state.records = payload.records
      state.totalRecs = payload.totalRecs
    },
    setRecord (state, payload) {
      if (payload === null) state.record = (typeof state.defaultRec === 'function') ? state.defaultRec() : _cloneDeep(state.defaultRec)
      else state.record = _cloneDeep(payload)
    },
    setPagination (state, payload) { state.pagination = payload },
    setFilterData (state, payload) { state.filterData = payload }
  },
  actions: { // Edit Actions
    setPagination ({ commit }, payload) {
      commit('setPagination', payload)
    },
    async deleteRecord ({ commit, getters }, payload) {
      payload.user = this.getters.user
      let res = await getters.crudOps.delete(payload)
      return res
    },
    async getRecord ({ commit, getters }, payload) {
      payload.user = this.getters.user
      let record = await getters.crudOps.findOne(payload)
      commit('setRecord', record)
    },
    async getRecords ({ commit, getters }, payload) {
      payload.user = this.getters.user
      let { records, pagination } = await getters.crudOps.find(payload)
      let totalRecs = payload.doPage ? pagination.totalItems : records.length
      commit('setPagination', pagination)
      commit('setFilterData', payload.filterData)
      commit('setRecords', { records, totalRecs })
    },
    async exportRecords ({ commit, getters }, payload) {
      payload.user = this.getters.user
      await getters.crudOps.export(payload)
    },
    async updateRecord ({ commit, getters }, payload) {
      payload.user = this.getters.user
      let res = await getters.crudOps.update(payload)
      return res
    },
    async createRecord ({ commit, getters, dispatch }, payload) {
      payload.user = this.getters.user
      let res = await getters.crudOps.create(payload)
      return res
    }
  }
}
export default {
  props: {
    parentId: { type: String, default: null },
    storeName: { type: String, required: true },
    crudFilter: { type: Object, required: true },
    crudTable: { type: Object, required: true },
    crudForm: { type: Object, required: true },
    crudOps: { type: Object, required: true }
  },
  async created () {
    const store = this.$store
    const name = this.storeName
    if (!(store && store.state && store.state[name])) { // register a new module only if doesn't exist
      store.registerModule(name, _cloneDeep(CrudStore)) // make sure its a deep clone
      store.state[name].defaultRec = this.crudForm.defaultRec
      store.state[name].filterData = this.crudFilter.filterData
      store.state[name].crudOps = this.crudOps
    } else { // re-use the already existing module
    }
    this.$options.filters.formatters = this.crudTable.formatters // create the formatters programatically

    // set inline edit fields
    if (this.crudTable.inline) this.inline = this.crudTable.inline

    this.headers = this.crudTable.headers
    this.actionColumn = this.headers.findIndex(header => header.value === '') !== -1

    // save by row?
    this.saveRow = this.crudTable.saveRow === true // default false

    // check if components and datas are present
    this.formAutoData = (this.isObject(this.crudForm.formAutoData)) ? this.crudForm.formAutoData : null
    this.hasFormVue = typeof this.crudForm.FormVue === 'function' || this.formAutoData
    this.hasFilterData = this.isObject(this.crudFilter.filterData)
    this.hasFilterVue = typeof this.crudFilter.FilterVue === 'function'
    this.hasSummaryVue = typeof this.crudTable.SummaryVue === 'function'

    // use add row to create record
    this.addrowCreate = this.crudTable.addrowCreate ? this.crudTable.addrowCreate : false

    // open form on row click
    this.onRowClickOpenForm = this.crudTable.onRowClickOpenForm !== false // default true

    // set confirmation
    this.confirmCreate = this.crudTable.confirmCreate === true // default false
    this.confirmUpdate = this.crudTable.confirmUpdate === true // default false
    this.confirmDelete = this.crudTable.confirmDelete !== false // default true

    // pagination
    this.doPage = this.crudTable.doPage !== false // default true

    // title
    this.crudTitle = this.crudTable.crudTitle || ''
    this.showGoBack = this.crudTable.showGoBack !== false // hide go back button - default true
    this.onCreatedOpenForm = this.crudTable.onCreatedOpenForm === true // open form on create, default false

    // more attributes
    this.attrs = Object.assign(this.attrs, this.crudTable.attrs || {})

    // assign the components
    if (this.hasFilterVue) this.$options.components['crud-filter'] = this.crudFilter.FilterVue
    if (this.hasFormVue) this.$options.components['crud-form'] = this.crudForm.FormVue
    if (this.hasSummaryVue) this.$options.components['crud-summary'] = this.crudTable.SummaryVue

    if (this.onCreatedOpenForm && this.record.id /* Not Needed? && !this.parentId */) { // nested CRUD, when coming back to a parent open a form
      this.crudFormFlag = true
    }

    // not needed in data() because it does not exist in template, an optimization which should be done for others as well
    this.isMounted = false // for future usage if any
  },
  async mounted () {
    if (!this.hasFilterVue) {
      for (var key in this.filterData) {
        if (this.filterData[key].attrs && this.filterData[key].itemsFn) this.filterData[key].attrs.items = await this.filterData[key].itemsFn()
      }
    }
    this.isMounted = true
  },
  beforeUpdate () {
    // IMPORTANT: Spent 5 days just to get this to work
    // somehow even if assign on mounted, and with using nextTick, things are still corrupt, until here!
    // this.$forceUpdate, helped to show what was happening after I assign the value (I used submitFilter to assign and forceUpdate to see)
    // suspected problem is because of async component
    //
    // if (this.storeName === 'multi-crud-party') console.log('vvvv4', this.storeName, this.$options.components['crud-filter'], this.crudFilter.FilterVue)
    if (this.hasFilterVue) this.$options.components['crud-filter'] = this.crudFilter.FilterVue
    if (this.hasFormVue) this.$options.components['crud-form'] = this.crudForm.FormVue
    if (this.hasSummaryVue) this.$options.components['crud-summary'] = this.crudTable.SummaryVue
  },
  beforeRouteEnter (to, from, next) { next(vm => { }) },
  data () {
    return {
      // form
      crudFormFlag: false,
      validForm: true,
      onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
      onRowClickOpenForm: true, // set to false of you do not want row click to open form
      hasFormVue: false,
      formAutoData: null, // if present autogenerate form

      // filter
      validFilter: true,
      hasFilterVue: false,
      hasFilterData: false,

      // summary
      hasSummaryVue: false,

      // data-table
      loading: false,
      inlineValue: null, // temporarily storing inline  edit values

      // crudTable
      headers: [ ], // pass in
      inline: false, // inline editing

      actionColumn: false,
      addrowCreate: false, // add row to create instead of using form
      saveRow: false,

      confirmCreate: false, // confirmation required flags
      confirmUpdate: false,
      confirmDelete: true,
      doPage: true, // paginate
      crudTitle: '', // title
      showGoBack: false,

      // styling
      attrs: {
        // you can add attributes used by the component and customize style and classes
        snackbar: { // v-snackbar Component - null means no snack bar
          bottom: true,
          timeout: 6000
        },
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
          'rows-per-page-items': [2, 5, 10, 20],
          'hide-headers': false,
          'loading-color': 'primary',
          style: { // this may need to be changed once Vuetify version 2.0 is out
            'max-height': 'calc(100vh - 144px)',
            'overflow-y': 'scroll',
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

      // show/hide
      showFilter: false,
      showSummary: false,

      // snackbar
      snackbar: false,
      snackbarText: ''
    }
  },
  computed: {
    showTitle () { return this.crudTitle || this.storeName },
    // ...mapGetters(storeModuleName, [ 'records', 'totalRecs', 'filterData', 'record' ]), // cannot use for multiple stores, try below
    records () { return this.$store.getters[this.storeName + '/records'] },
    totalRecs () { return this.$store.getters[this.storeName + '/totalRecs'] },
    filterData () { return this.$store.getters[this.storeName + '/filterData'] },
    // pagination () { return this.$store.getters[this.storeName + '/pagination'] }, // not used
    record () { return this.$store.getters[this.storeName + '/record'] },
    pagination: {
      get: function () {
        let rv = { }
        try {
          rv = this.$store.state[this.storeName].pagination
        } catch (e) {
          // console.log('Catch computed pagination:', e.message)
        }
        return rv
      },
      set: function (value) {
        this.setPagination(value)
      }
    },
    // computed permissions
    canCreate () { return this.can('create', this.crudOps.create && (this.addrowCreate || this.hasFormVue || this.formAutoData)) },
    canUpdate () { return this.can('update', this.crudOps.update && (this.hasFormVue || this.formAutoData)) },
    canDelete () { return this.can('delete', this.crudOps.delete) }
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  watch: {
    loading: function (newValue, oldValue) { },
    pagination: {
      handler () {
        this.getRecordsHelper()
      },
      deep: true
    },
    parentId (value) {
      this.getRecordsHelper()
    }
  },
  methods: {
    can (operation, flag) {
      if (this.$store.getters.user && this.$store.getters.user.rules) {
        const { rules } = this.$store.getters.user
        if (
          (rules[this.storeName] && (rules[this.storeName].indexOf(operation) !== -1 || rules[this.storeName].indexOf('*') !== -1)) ||
          (rules['*'] && (rules['*'].indexOf(operation) !== -1 || rules['*'].indexOf('*') !== -1))
        ) {
          return true && flag
        } else {
          return false
        }
      }
      return true && flag
    },
    isObject (obj) { return obj !== null && typeof obj === 'object' },
    setSnackBar (statusCode) {
      if (this.attrs.snackbar && statusCode) {
        this.snackbarText = this.$t('vueCrudX.unknownOperation')
        if (statusCode === 200 || statusCode === 201) this.snackbarText = this.$t('vueCrudX.operationOk')
        else if (statusCode === 500) this.snackbarText = this.$t('vueCrudX.operationError')
        else if (statusCode === 409) this.snackbarText = this.$t('vueCrudX.duplicateError')
        this.snackbar = true
      }
    },
    async getRecords (payload) {
      await this.$store.dispatch(this.storeName + '/getRecords', payload)
    },
    setPagination (payload) { this.$store.dispatch(this.storeName + '/setPagination', payload) },
    async deleteRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/deleteRecord', payload)
      this.loading = false
      this.setSnackBar(res)
      return res === 200
    },
    async updateRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/updateRecord', payload)
      this.loading = false
      this.setSnackBar(res)
      return res === 200
    },
    async createRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/createRecord', payload)
      this.loading = false
      this.setSnackBar(res)
      return res === 201
    },
    async getRecord (payload) {
      this.loading = true
      await this.$store.dispatch(this.storeName + '/getRecord', payload)
      this.loading = false
    },
    setRecord (payload) { this.$store.commit(this.storeName + '/setRecord', null) }, // NOTE: mutated here without dispatching action
    async exportRecords (payload) { await this.$store.dispatch(this.storeName + '/exportRecords', payload) },
    closeCrudForm () {
      this.setRecord() // clear it
      this.crudFormFlag = false
      this.$emit('form-close') // emit event if close form
    },
    async crudFormOpen (id) {
      if (id) await this.getRecord({ id }) // edit
      else this.setRecord() // add
      this.crudFormFlag = true
    },
    async crudFormSave (e) {
      if (this.record.id && this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      if (!this.record.id && this.confirmUpdate) if (!confirm(this.$t('vueCrudX.confirm'))) return

      if (this.record.id) await this.updateRecord({ record: this.record })
      else await this.createRecord({ record: this.record, parentId: this.parentId })
      await this.getRecordsHelper()
      this.closeCrudForm()
    },
    async crudFormDelete (e) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      const { id } = this.record
      if (id) {
        await this.deleteRecord({ id })
        await this.getRecordsHelper()
      }
      this.closeCrudForm()
    },
    async getRecordsHelper () {
      this.loading = true
      await this.getRecords({
        doPage: this.doPage,
        pagination: this.pagination,
        filterData: this.filterData,
        parentId: this.parentId
      })
      this.loading = false
    },
    async submitFilter () {
      // TOREMOVE why was this here in the first place? await this.getRecords()
      await this.getRecordsHelper()
    },
    // clearFilter () { this.$refs.searchForm.reset() }, // can do test code here too
    async exportBtnClick () {
      this.loading = true
      await this.exportRecords({
        pagination: this.pagination,
        filterData: this.filterData,
        parentId: this.parentId
      })
      this.loading = false
    },
    goBack () {
      this.$router.back()
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
    async inlineUpdate (item, field, row, col) {
      if (!field || (item[field] !== this.inlineValue && !this.saveRow)) { // field undefined means update row
        const rv = await this.updateRecord({ record: item })
        if (!rv) item[field] = this.inlineValue // if false undo changes
      } // else console.log('no changes')
      if (row !== undefined && col !== undefined) { // datepicker / timepicker for now
        const ref = this.$refs[`edit-${row}-${col}`][0]
        const tag = ref.$children[0].$children[0].$children[0].$options._componentTag
        if (tag === 'v-date-picker' || tag === 'v-time-picker' || tag === 'v-textarea') ref.save(item[field]) // = false
      }
    },
    async inlineCancel (row, col) {
      if (row !== undefined && col !== undefined) { // datepicker / timepicker for now
        const ref = this.$refs[`edit-${row}-${col}`][0]
        ref.cancel()
      }
    },
    async inlineCreate () {
      let record = (typeof this.crudForm.defaultRec === 'function') ? this.crudForm.defaultRec() : this.crudForm.defaultRec
      for (let i = 0; i < this.addrowCreate.length; i++) {
        const { field, label } = this.addrowCreate[i]
        const val = prompt(label, record[field])
        if (val) record[field] = val
        else return
      }
      if (this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.createRecord({ record, parentId: this.parentId })
      this.$nextTick(async function () { await this.getRecordsHelper() })
    },
    async inlineDelete (id) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.deleteRecord({ id })
      this.$nextTick(async function () { await this.getRecordsHelper() })
    },
    rowClicked (item, event) {
      if (!this.actionColumn && this.onRowClickOpenForm) this.crudFormOpen(item.id) // no action column && row click opens form
      if (!this.inline) this.$emit('selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
    },
    async testFunction () { // for testing anything
    }
  }
}
</script>

<template>
  <v-container v-bind="attrs.container">
    <v-toolbar v-bind="attrs.toolbar">
      <!-- <v-toolbar-side-icon ></v-toolbar-side-icon> -->
      <v-toolbar-title><v-btn v-if="parentId && showGoBack" v-bind="attrs.button" @click.stop="goBack" :disabled="loading"><v-icon>reply</v-icon></v-btn> {{showTitle | capitalize}} {{ doPage ? '' : ` (${records.length})` }}</v-toolbar-title>
      <v-btn v-if="hasSummaryVue" v-bind="attrs.button" @click="showSummary=!showSummary" :disabled="loading"><v-icon>{{ showSummary ? 'keyboard_arrow_up' : 'list'}}</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-btn v-bind="attrs.button" @click="showFilter=!showFilter" :disabled="!hasFilterData"><v-icon>{{ showFilter ? 'keyboard_arrow_up' : 'search'}}</v-icon></v-btn>
      <v-btn v-bind="attrs.button" @click="submitFilter" :disabled="!validFilter || loading"><v-icon>replay</v-icon></v-btn>
      <v-btn v-if="canCreate" v-bind="attrs.button" @click.stop="addrowCreate?inlineCreate():crudFormOpen(null)" :disabled="loading"><v-icon>add</v-icon></v-btn>
      <v-btn v-if="crudOps.export" v-bind="attrs.button" @click.stop="exportBtnClick" :disabled="loading"><v-icon>print</v-icon></v-btn>
    </v-toolbar>
    <div v-if="showFilter">
      <v-form v-if="hasFilterData" v-model="validFilter" ref="searchForm" v-bind="attrs.form">
        <crud-filter v-if="hasFilterVue" :filterData="filterData" :parentId="parentId" :storeName="storeName" />
        <v-layout row wrap v-else>
          <v-flex v-for="(filter, index) in filterData" :key="index" :sm6="filter.halfSize" xs12>
            <component :is="filter.type" v-model="filter.value" v-bind="filter.attrs"></component>
          </v-flex>
        </v-layout>
        <!-- <v-layout row justify-end>
          <v-btn v-bind="attrs.button" @click="submitFilter" :disabled="!validFilter || loading"><v-icon>replay</v-icon></v-btn>
        </v-layout> -->
      </v-form>
    </div>
    <v-data-table
      :headers="headers"
      :items="records"
      :total-items="totalRecs"
      :pagination.sync="pagination"
      :loading="loading?attrs.table['loading-color']:false"
      :hide-actions="!doPage"
      v-bind="attrs.table"
    >
      <template slot="items" slot-scope="props">
        <!-- tr @click.stop="(e) => crudFormOpen(e, props.item.id, $event)" AVOID ARROW fuctions -->
        <tr @click.stop="rowClicked(props.item, $event)">
          <td :key="header.value" v-for="(header, index) in headers" :class="header['cell-class']?header['cell-class']:header.class">
            <span v-if="header.value===''">
              <v-icon v-if="canUpdate" v-bind="attrs['action-icon']" @click.stop="crudFormOpen(props.item.id)" :disabled="loading">edit</v-icon>
              <v-icon v-if="canDelete" v-bind="attrs['action-icon']" @click.stop="inlineDelete(props.item.id)" :disabled="loading">delete</v-icon>
              <v-icon v-if="saveRow" v-bind="attrs['action-icon']" @click.stop="inlineUpdate(props.item)" :disabled="loading">save</v-icon>
            </span>
            <span v-if="!inline[header.value]" v-html="$options.filters.formatters(props.item[header.value], header.value)"></span>
            <!-- <span v-if="!inline[header.value]">{{ props.item[header.value] | formatters(header.value) }}</span> -->
            <v-edit-dialog
              v-else-if="inline[header.value].field==='v-date-picker'||inline[header.value].field==='v-time-picker'||inline[header.value].field==='v-textarea'"
              :ref="`edit-${props.index}-${index}`"
              :return-value.sync="props.item[header.value]"
              :large="inline[header.value].buttons"
              :persistent="false"
              :cancel-text="$t('vueCrudX.cancel')"
              :save-text="$t('vueCrudX.save')"
              lazy
              @save="saveRow?'':inlineUpdate(props.item, header.value)"
              @cancel="()=>{ }"
              @open="inlineOpen(props.item[header.value], props.index, index)"
              @close="()=>{ }"
            >
              <div>{{attrs['edit-indicator-left']}}{{ props.item[header.value] }}{{attrs['edit-indicator-right']}}</div>
              <component
                :is="inline[header.value].field"
                slot="input"
                @input="inline[header.value].field!=='v-textarea'?inlineUpdate(props.item, header.value, props.index, index):''"
                @blur="inline[header.value].field==='v-textarea'?inlineUpdate(props.item, header.value, props.index, index):''"
                v-model="props.item[header.value]"
                v-bind="inline[header.value].attrs"
              ></component>
            </v-edit-dialog>
            <component
              v-else-if="inline[header.value].field==='v-text-field'||inline[header.value].field==='v-select'||inline[header.value].field==='v-combobox'||inline[header.value].field==='v-autocomplete'"
              :is="inline[header.value].field"
              v-bind="inline[header.value].attrs"
              v-model="props.item[header.value]"
              @focus="inlineOpen(props.item[header.value])"
              @blur="inlineUpdate(props.item, header.value)"
            ></component>
          </td>
        </tr>
      </template>
      <!-- IMPLEMENT IN FUTURE AS IT IS CHANGE THAT NEEDS VERSION 1.2.X
        <template slot="actions-append">
          <v-icon v-if="canCreate" @click.stop="addrowCreate?inlineCreate():crudFormOpen(null)" :disabled="loading">add</v-icon>
        </template>
      -->
      <template slot="no-data">
        <v-flex class="text-xs-center">
          <v-alert :value="true" v-bind="attrs.alert"><v-icon>warning</v-icon> {{$t?$t('vueCrudX.noData'):'NO DATA'}}</v-alert>
        </v-flex>
      </template>
    </v-data-table>

    <div v-if="showSummary">
      <crud-summary v-if="hasSummaryVue" :records="records" :parentId="parentId" :storeName="storeName" />
    </div>

    <v-layout row justify-center>
      <v-dialog v-model="crudFormFlag" v-bind="attrs.dialog">
        <v-card>
          <v-toolbar v-bind="attrs.toolbar">
            <v-toolbar-title><v-btn v-bind="attrs.button" @click.native="closeCrudForm" :disabled="loading"><v-icon>close</v-icon></v-btn> {{showTitle | capitalize}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn v-bind="attrs.button" v-if="canDelete && record.id" @click.native="crudFormDelete" :disabled="loading"><v-icon>delete</v-icon></v-btn>
            <v-btn v-bind="attrs.button" v-if="canUpdate && record.id||canCreate && !record.id" :disabled="!validForm||loading" @click.native="crudFormSave"><v-icon>save</v-icon></v-btn>
            <v-toolbar-items></v-toolbar-items>
          </v-toolbar>
          <component :is="attrs['v-progress-circular']?'v-progress-circular':'v-progress-linear'" :indeterminate="loading"></component>

          <v-form v-if="hasFormVue" v-model="validForm" v-bind="attrs.form">
            <crud-form v-if="!formAutoData" :record="record" :parentId="parentId" :storeName="storeName" />
            <v-layout row wrap v-else>
              <v-flex v-for="(form, objKey, index) in formAutoData" :key="index" :sm6="form.halfSize" xs12>
                <component v-if="form.type==='hidden'" :is="'div'"></component>
                <component v-else :is="form.type" v-model="record[objKey]" v-bind="form.attrs"></component>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-snackbar v-if="attrs.snackbar" v-model="snackbar" v-bind="attrs.snackbar">
      {{ snackbarText }}
      <v-btn fab flat @click="snackbar=false"><v-icon >close</v-icon></v-btn>
    </v-snackbar>
  </v-container>
</template>

<style lang="css">
/*
customizing v-edit-dialog background colors
scoped made it not work...
*/
/*
.theme--dark .v-menu__content {
  background-color: #424242 !important;
}
.theme--light .v-menu__content {
  background-color: #ffffff !important;
}
*/
</style>

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
