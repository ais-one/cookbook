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
    this.saveRow = this.crudTable.saveRow ? this.crudTable.saveRow : false // default false
    this.inlineReload = Object.assign(this.inlineReload, this.crudTable.inlineReload || {}) // default true

    // check if components and datas are present
    this.formAutoData = (this.isObject(this.crudForm.formAutoData)) ? this.crudForm.formAutoData : null
    this.hasFormVue = typeof this.crudForm.FormVue === 'function' || this.formAutoData
    this.hasFilterData = this.isObject(this.crudFilter.filterData)
    this.hasFilterVue = typeof this.crudFilter.FilterVue === 'function'

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
    this.onCreatedOpenForm = this.crudTable.onCreatedOpenForm === true // open form on create - default false
    this.showFilterButton = this.crudTable.showFilterButton !== false // show filter button - default true

    // more attributes
    this.attrs = Object.assign(this.attrs, this.crudTable.attrs || {})
    this.buttons = Object.assign(this.buttons, this.crudTable.buttons || {})

    // assign the components
    if (this.hasFilterVue) this.$options.components['crud-filter'] = this.crudFilter.FilterVue
    if (this.hasFormVue) this.$options.components['crud-form'] = this.crudForm.FormVue

    if (this.onCreatedOpenForm && this.record.id /* Not Needed? && !this.parentId */) { // nested CRUD, when coming back to a parent open a form
      this.crudFormFlag = true
    }

    // not needed in data() because it does not exist in template, an optimization which should be done for others as well
    this.isMounted = false // for future usage if any
  },
  async mounted () {
    if (typeof this.$t !== 'function') { // if no internationalization
      this.$t = text => text
    }
    for (let key in this.filterData) { // type to field
      if (this.filterData[key].type) this.filterData[key].field = this.filterData[key].type // TODEPRECATE
      if (this.filterData[key].attrs && this.filterData[key].itemsFn) this.filterData[key].attrs.items = await this.filterData[key].itemsFn()
    }
    if (this.formAutoData) { // type to field // TODEPRECATE
      for (let key in this.formAutoData) {
        if (this.formAutoData[key].type) this.formAutoData[key].field = this.formAutoData[key].type
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
      doPage: true, // paginate
      crudTitle: '', // title
      showGoBack: false,

      // supported controls
      selectControls: ['v-autocomplete', 'v-switch', 'v-select', 'v-combobox', 'v-checkbox'],
      groupControls: ['v-btn-toggle', 'v-radio-group'], // need to check if iteration is common? if not need to find a way to handle it, v-radio-group is different

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
          'rows-per-page-items': [2, 5, 10, 20],
          'hide-headers': false,
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

      // snackbar
      snackbar: false,
      snackbarText: ''
    }
  },
  computed: {
    hasFormSlot () { return !!this.$scopedSlots['form'] },
    hasFilterSlot () { return !!this.$scopedSlots['filter'] },
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
    setSnackBar (res) {
      if (!res) return
      if (this.attrs.snackbar) {
        let code
        this.snackbarText = ''
        this.snackbar = false
        if (typeof res === 'object') { // TODEPRECATE this check
          // if message is empty use code... 200 (ok), 201 (ok created), 409 (duplicate), 500 (server error)
          // not implemented - 401 (client error), 403 (forbidden), 404 (not found)
          if (res.msg) {
            this.snackbarText = this.$t(res.msg) // code will be undefined
          } else {
            code = res.code
          }
        } else {
          code = res // TODEPRECATE
        }
        if (code) {
          this.snackbarText = this.$t('vueCrudX.unknownOperation')
          if (code === 200 || code === 201) this.snackbarText = this.$t('vueCrudX.operationOk')
          else if (code === 500) this.snackbarText = this.$t('vueCrudX.operationError')
          else if (code === 409) this.snackbarText = this.$t('vueCrudX.duplicateError')
        }
        this.snackbar = !!this.snackbarText
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
      this.$emit('deleted', { res, payload })
      this.setSnackBar(res)
    },
    async updateRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/updateRecord', payload)
      this.loading = false
      this.$emit('updated', { res, payload })
      this.setSnackBar(res)
      if (typeof res === 'object') return res.ok // TODEPRECATE this check
      else return res === 200 // TODEPRECATE
    },
    async createRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/createRecord', payload)
      this.loading = false
      this.$emit('created', { res, payload }) // no ID yet, TBD...
      this.setSnackBar(res)
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
      this.$emit('form-open', this.record) // emit event if close form
    },
    async crudFormSave (e) {
      if (!this.record.id && this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      if (this.record.id && this.confirmUpdate) if (!confirm(this.$t('vueCrudX.confirm'))) return

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
      if (this.saveRow) {
        this.clearEditing()
      }
      // TOREMOVE why was this here in the first place? await this.getRecords()
      await this.getRecordsHelper()
      this.$emit('loaded', Date.now())
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
    isEditing (row) { // check if a row is editing
      // for (let i = 0; i < this.records.length; i++) {
      //   if (this.$refs[`edit-${i}`].style['background-color']) return true
      // }
      // return false
      // console.log('isEditing', this.editing)
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
      // TOREMOVE Not Needed For Individual Saves
      // if (!this.saveRow) {
      //   this.editing pop // if individual field saves
      // }
    },
    async inlineCancel (row, col) { // UNUSED...
      if (row !== undefined && col !== undefined) { // datepicker / timepicker for now
        const ref = this.$refs[`edit-${row}-${col}`][0]
        ref.cancel()
      }
    },
    async inlineCreate () {
      let record = (typeof this.crudForm.defaultRec === 'function') ? this.crudForm.defaultRec() : this.crudForm.defaultRec

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
    rowClicked (item, event, row) {
      if (!this.actionColumn && this.onRowClickOpenForm) this.crudFormOpen(item.id) // no action column && row click opens form
      if (!this.inline) {
        this.$emit('selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
      }
    },
    async testFunction (_in) { // for testing anything
      console.log(_in)
    }
  }
}
</script>

<template>
  <v-container v-bind="attrs.container">
    <v-toolbar v-bind="attrs.toolbar">
      <!-- <v-toolbar-side-icon ></v-toolbar-side-icon> -->
      <v-toolbar-title><v-btn v-if="parentId && showGoBack" v-bind="attrs.button" @click.stop="goBack" :disabled="loading"><v-icon>{{buttons.back.icon}}</v-icon><span>{{buttons.back.label}}</span></v-btn> {{showTitle | capitalize}} {{ doPage ? '' : ` (${records.length})` }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="showFilterButton||hasFilterSlot" v-bind="attrs.button" @click="expandFilter=!expandFilter" :disabled="!hasFilterData"><v-icon>{{ expandFilter ? buttons.filter.icon2 : buttons.filter.icon }}</v-icon><span>{{buttons.filter.label}}</span></v-btn>
      <v-btn v-bind="attrs.button" @click="submitFilter" :disabled="!validFilter || loading"><v-icon>{{buttons.reload.icon}}</v-icon><span>{{buttons.reload.label}}</span></v-btn>
      <v-btn v-if="canCreate" v-bind="attrs.button" @click.stop="addrowCreate?inlineCreate():crudFormOpen(null)" :disabled="loading"><v-icon>{{buttons.create.icon}}</v-icon><span>{{buttons.create.label}}</span></v-btn>
      <v-btn v-if="crudOps.export" v-bind="attrs.button" @click.stop.prevent="exportBtnClick" :disabled="loading"><v-icon>{{buttons.export.icon}}</v-icon><span>{{buttons.export.label}}</span></v-btn>
    </v-toolbar>
    <div v-if="expandFilter">
      <v-form v-if="hasFilterData" v-model="validFilter" ref="searchForm" v-bind="attrs.form">
        <slot name="filter" :filterData="filterData" :parentId="parentId" :storeName="storeName">
          <crud-filter v-if="hasFilterVue" :filterData="filterData" :parentId="parentId" :storeName="storeName" :vueCrudX="_self" />
          <v-layout row wrap v-else>
              <v-flex v-for="(filter, index) in filterData" :key="index" :sm6="filter.halfSize" xs12>
                <component :is="filter.field" v-model="filter.value" v-bind="filter.attrs">
                  <template v-if="filter.field==='v-btn-toggle'">
                    <component :is="'v-btn'" v-for="(value, key, index) in filter.group.items" :key="index" :value="key" v-bind="filter.group.attrs">{{ value }}</component>
                  </template>
                  <template v-else-if="filter.field==='v-radio-group'">
                    <component :is="'v-radio'" v-for="(value, key, index) in filter.group.items" :key="index" :value="key" :label="value" v-bind="filter.group.attrs"></component>
                  </template>
                </component>
              </v-flex>
            </v-layout>
        </slot>
        <!-- <v-layout row justify-end></v-layout> -->
      </v-form>
    </div>
    <slot name="table" :records="records" :totalRecs="totalRecs" :pagination="pagination">
      <v-data-table
        :headers="headers"
        :items="records"
        :total-items="totalRecs"
        :pagination.sync="pagination"
        :loading="loading?attrs.table['loading-color']:false"
        :hide-actions="!doPage"
        v-bind="attrs.table"
        class="fixed-header v-table__overflow"
      >
        <template slot="headerCell" slot-scope="props">
          <span v-html="props.header.text"></span>
        </template>
        <!-- <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox
                :input-value="props.all"
                :indeterminate="props.indeterminate"
                primary
                hide-details
                @click.native="toggleAll"
              ></v-checkbox>
            </th>
            <th
              v-for="header in props.headers"
              :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template> -->
        <template slot="items" slot-scope="props">
          <!-- tr @click.stop="(e) => crudFormOpen(e, props.item.id, $event)" AVOID ARROW fuctions -->
          <tr :ref="`edit-${props.index}`" @click.stop="rowClicked(props.item, $event, props.index)">
            <td :key="header.value" v-for="(header, index) in headers" :class="header['cell-class']?header['cell-class']:header.class">
              <span v-if="header.value===''">
                <v-icon v-if="canUpdate&&!saveRow" v-bind="attrs['action-icon']" @click.stop="crudFormOpen(props.item.id)" :disabled="loading">edit</v-icon>
                <v-icon v-if="canDelete" v-bind="attrs['action-icon']" @click.stop="inlineDelete(props.item.id)" :disabled="loading">delete</v-icon>
                <v-icon v-if="crudOps.update&&saveRow" v-bind="attrs['action-icon']" @click.stop="inlineUpdate(props.item, null, props.index, index)" :disabled="loading">save</v-icon>
              </span>
              <span v-else-if="!inline[header.value]" v-html="$options.filters.formatters(props.item[header.value], header.value)"></span>
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
    </slot>

    <slot name="summary"></slot>

    <v-layout row justify-center>
      <v-dialog v-model="crudFormFlag" v-bind="attrs.dialog">
        <v-card>
          <v-toolbar v-bind="attrs.toolbar">
            <v-toolbar-title><v-btn v-bind="attrs.button" @click.native="closeCrudForm" :disabled="loading"><v-icon>{{buttons.close.icon}}</v-icon><span>{{buttons.close.label}}</span></v-btn> {{showTitle | capitalize}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn v-bind="attrs.button" v-if="canDelete && record.id" @click.native="crudFormDelete" :disabled="loading"><v-icon>{{buttons.delete.icon}}</v-icon><span>{{buttons.delete.label}}</span></v-btn>
              <v-btn v-bind="attrs.button" v-if="canUpdate && record.id||canCreate && !record.id" :disabled="!validForm||loading" @click.native="crudFormSave"><v-icon>{{buttons.update.icon}}</v-icon><span>{{buttons.update.label}}</span></v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <component :is="attrs['v-progress-circular']?'v-progress-circular':'v-progress-linear'" :indeterminate="loading" v-bind="attrs['v-progress-circular']?attrs['v-progress-circular']:attrs['v-progress-linear']"></component>
          <v-form v-if="hasFormVue" v-model="validForm" v-bind="attrs.form">
            <slot name="form" :record="record" :parentId="parentId" :storeName="storeName">
              <crud-form v-if="!formAutoData" :record="record" :parentId="parentId" :storeName="storeName" :vueCrudX="_self" />
              <v-layout row wrap v-else>
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
            </slot>
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

<style lang="stylus" scoped>
.v-toolbar >>> .v-btn__content {
  flex-direction: column;
  font-size: 75%;
}

/*
@import '~vuetify/src/stylus/bootstrap'
@import '~vuetify/src/stylus/settings/_theme.styl'
fixed-header($material)
    &
        background-color: $material.cards

    th
        background-color: $material.cards

        &:after
            border-bottom: 1px solid rgba($material.fg-color, $material.divider-percent)
theme($component, $name)
  light($component, $name)
  dark($component, $name)

light($component, $name)
  .theme--light .{$name}
    $component($material-light)

dark($component, $name)
  .theme--dark .{$name}
    $component($material-dark)
*/

>>> .theme--dark.v-table thead th {
  background-color: #424242;
}

>>> .theme--light.v-table thead th {
  background-color: #ffffff;
}

/* Theme */
>>> .fixed-header
    &
        display: flex
        flex-direction: column
        height: 100%

    table
        table-layout: fixed

    th
        position: sticky
        top: 0
        z-index: 5

        &:after
            content: ''
            position: absolute
            left: 0
            bottom: 0
            width: 100%

    tr.v-datatable__progress
        th
            // top: 56px
            height: 1px;

    .v-table__overflow
        flex-grow: 1
        flex-shrink: 1
        overflow-x: auto
        overflow-y: auto
        // overflow: auto
        // height: 100%

    .v-datatable.v-table
        flex-grow: 0
        flex-shrink: 1

        .v-datatable__actions
            flex-wrap: nowrap

            .v-datatable__actions__pagination
                white-space: nowrap
</style>
