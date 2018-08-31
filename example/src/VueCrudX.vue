<script>
// TBD
// 1) properties to handle: dark or light
// color="success"
//  - form toolbar
//  - no data error
//  - dialog background
// 2) to consider: expand, select & select-all item-key="id"
// 3) user access control to operations

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
    crudOps: { type: Object, required: true },
    crudSnackBar: { type: Object, default: () => ({ bottom: true, timeout: 6000 }) }
  },
  created () {
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

    // is there an action column
    this.actionColumn = this.crudTable.actionColumn === true // default false
    if (this.actionColumn) { // WARNING what if this.crudTable.headers undefined or wrong?
      this.headers = [{ text: 'Actions', value: 'id', sortable: false }, ...this.crudTable.headers]
    } else {
      this.headers = this.crudTable.headers
    }

    // set the permissions
    this.canUpdate = this.crudOps.update && !!this.crudForm.FormVue().component // add user permissions later
    this.canDelete = this.crudOps.delete // add user permissions later
    this.canCreate = this.crudOps.create && !!this.crudForm.FormVue().component // add user permissions later

    // open form on row click
    this.c = this.crudTable.onRowClickOpenForm !== false // default true

    // use add row to create record
    this.addrowCreate = this.crudTable.addrowCreate === true // default false

    // set confirmation
    this.confirmCreate = this.crudTable.confirmCreate === true // default false
    this.confirmUpdate = this.crudTable.confirmUpdate === true // default false
    this.confirmDelete = this.crudTable.confirmDelete !== false // default true

    // pagination
    this.doPage = this.crudTable.doPage !== false // default true

    // title
    this.crudTitle = this.crudTable.crudTitle || ''

    this.showGoBack = this.crudTable.showGoBack !== false // hide go back button - default true
    this.fullscreenForm = this.crudTable.fullscreenForm !== false // form full screen? - default true
    this.onCreatedOpenForm = this.crudTable.onCreatedOpenForm === true // open form on create, default false

    // some styling
    this.hideHeaders = this.crudTable.hideHeaders === true // default false
    this.isFluid = this.crudTable.isFluid !== false // default true
    this.dark = !!this.$attrs.dark // from router-view?
    this.fab = !!this.$attrs.fab

    // assign the components
    this.$options.components['crud-filter'] = this.crudFilter.FilterVue
    this.$options.components['crud-form'] = this.crudForm.FormVue

    if (this.onCreatedOpenForm && this.record.id /* Not Needed? && !this.parentId */) { // nested CRUD, when coming back to a parent open a form
      this.crudFormFlag = true
    }
  },
  async mounted () {
    if (this.crudFilter.FilterVue().component === null) {
      for (var key in this.filterData) {
        if (this.filterData[key].itemsFn) this.filterData[key].items = await this.filterData[key].itemsFn()
      }
    }
  },
  beforeUpdate () { },
  beforeRouteEnter (to, from, next) { next(vm => { }) },
  data () {
    return {
      // form
      onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
      crudFormFlag: false,
      validForm: true,
      onRowClickOpenForm: true, // set to false of you do not want row click to open form

      // filter
      validFilter: true,

      // data-table
      loading: false,
      inlineValue: null, // temporarily storing inline  edit values
      fullscreenForm: false,

      // crudTable
      headers: [ ], // pass in
      inline: false, // inline editing

      actionColumn: false,
      canDelete: true,
      canUpdate: true,
      canCreate: true,
      addrowCreate: false, // add row to create instead of using form

      confirmCreate: false, // confirmation required flags
      confirmUpdate: false,
      confirmDelete: true,
      doPage: true, // paginate
      crudTitle: '', // title
      showGoBack: false,

      // some styling
      isFluid: true,
      hideHeaders: false,
      dark: false,
      fab: false,

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
    }
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
    setSnackBar (statusCode) {
      if (this.crudSnackBar && statusCode) {
        this.snackbarText = 'Unknown Operation'
        if (statusCode === 200 || statusCode === 201) this.snackbarText = 'OK'
        else if (statusCode === 500) this.snackbarText = 'Operation Error'
        else if (statusCode === 409) this.snackbarText = 'Duplicate Error'
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
    setRecord (payload) { this.$store.commit(this.storeName + '/setRecord', null) },
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
      await this.getRecords()
      await this.getRecordsHelper()
    },
    async exportBtnClick () {
      this.loading = true
      await this.exportRecords({
        pagination: this.pagination,
        filterData: this.filterData,
        parentId: this.parentId
      })
      this.loading = false
    },

    // clearFilter () { this.$refs.searchForm.reset() }, // can do test code here too
    goBack () {
      this.$router.back()
    },

    // inline
    inlineOpen (value) {
      this.inlineValue = value
    },
    async inlineUpdate (item, field) {
      const rv = await this.updateRecord({ record: item })
      if (!rv) item[field] = this.inlineValue // if false undo changes
    },
    async inlineCreate () {
      if (this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.createRecord({ record: (typeof this.crudForm.defaultRec === 'function') ? this.crudForm.defaultRec() : this.crudForm.defaultRec, parentId: this.parentId })
      this.$nextTick(async function () { await this.getRecordsHelper() })
    },
    async inlineDelete (id) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.deleteRecord({ id })
      this.$nextTick(async function () { await this.getRecordsHelper() })
    },
    rowClicked (item, event) {
      console.log('rowClicked', this.onRowClickOpenForm)
      if (!this.actionColumn && this.onRowClickOpenForm) this.crudFormOpen(item.id) // no action column && row click opens form
      if (!this.inline) this.$emit('selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
    }
  }
}
</script>

<template>
  <v-container v-bind:class="{ 'make-modal': parentId }" :fluid="isFluid">
    <v-expansion-panel>
      <v-expansion-panel-content class="grey lighten-1">
        <div slot="header" ><v-icon>search</v-icon> {{showTitle | capitalize}} {{ doPage ? '' : ` - ${records.length} Records` }}</div>
        <v-form class="grey lighten-3 pa-2" v-model="validFilter" ref="searchForm" lazy-validation>
          <crud-filter v-if="crudFilter.FilterVue().component" :filterData="filterData" :parentId="parentId" :storeName="storeName" />
          <v-layout row wrap v-else>
            <v-flex v-for="(filter, index) in filterData" :key="index" :sm6="filter.sm6" xs12 class="pa-2">
              <component v-if="filter.type === 'select'" :is="'v-select'" v-model="filter.value" :multiple="filter.multiple" :label="filter.label" :items="filter.items" :rules="filter.rules"></component>
              <component v-if="filter.type === 'select-kv'" :is="'v-select'" v-model="filter.value" :multiple="filter.multiple" :label="filter.label" :items="filter.items" :rules="filter.rules" item-value="value" item-text="text" return-object></component>
              <component v-if="filter.type === 'date'" :is="'v-text-field'" v-model="filter.value" :label="filter.label" :rules="filter.rules" type="date"></component>
              <component v-if="filter.type === 'text'" :is="'v-text-field'" v-model="filter.value" :label="filter.label" :rules="filter.rules" type="text"></component>
            </v-flex>
          </v-layout>
          <v-layout row justify-end>
            <!-- v-btn :fab="fab" @click="clearFilter"><v-icon>close</v-icon></v-btn -->
            <v-btn :fab="fab" @click="submitFilter" :disabled="!validFilter || loading"><v-icon>replay</v-icon></v-btn>
          </v-layout>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-data-table
      :headers="headers"
      :items="records"
      :total-items="totalRecs"
      :pagination.sync="pagination"
      :loading="loading"
      class="elevation-1"
      :hide-actions="!doPage"
      :hide-headers="hideHeaders"
      :dark="dark"
      :light="!dark"
    >
      <template slot="items" slot-scope="props">
        <!-- tr @click.stop="(e) => crudFormOpen(e, props.item.id, $event)" AVOID ARROW fuctions -->
        <tr @click.stop="rowClicked(props.item, $event)">
          <td v-if="actionColumn" class="justify-left layout">
            <v-icon v-if="canUpdate" small class="mr-2" @click.stop="crudFormOpen(props.item.id)" :disabled="loading">edit</v-icon>
            <v-icon v-if="canDelete" small class="mr-2" @click.stop="inlineDelete(props.item.id)" :disabled="loading">delete</v-icon>
          </td>
          <!-- for now, lighten (grey lighten-4) editable columns until fixed header is implemented -->
          <td :key="header.value" v-for="(header, index) in headers"  v-if="actionColumn?index>0:index>=0" :class="{ 'grey lighten-4': (inline[header.value] && crudOps.update) }">
            <v-edit-dialog v-if="inline[header.value] && crudOps.update"
              :return-value.sync="props.item[header.value]"
              large
              lazy
              persistent
              @save="inlineUpdate(props.item, header.value)"
              @cancel="()=>{}"
              @open="inlineOpen(props.item[header.value])"
              @close="()=>{}"
            >
              <div>{{ props.item[header.value] }}</div>
              <div slot="input" class="mt-3 title">Update Field</div>
              <component :is="inline[header.value]==='textarea'?'v-textarea':'v-text-field'" slot="input" v-model="props.item[header.value]" label="Edit" :type="inline[header.value]" single-line counter autofocus></component>
            </v-edit-dialog>
            <span v-else>{{ props.item[header.value] | formatters(header.value) }}</span>
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
          <v-alert :value="true" color="error" icon=""><v-icon>warning</v-icon> {{$t?$t('vueCrudX.noData'):'NO DATA'}}</v-alert>
        </v-flex>
      </template>
    </v-data-table>

    <v-layout row justify-center>
      <v-dialog v-model="crudFormFlag" :fullscreen="fullscreenForm" scrollable transition="dialog-bottom-transition" :overlay="false">
        <v-card>
          <v-toolbar :dark="!dark" :light="dark" color="primary">
            <v-toolbar-title><v-icon>mode_edit</v-icon> {{showTitle | capitalize}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items></v-toolbar-items>
          </v-toolbar>
          <v-progress-linear :indeterminate="loading" height="2"></v-progress-linear>
          <v-form class="grey lighten-3 pa-2" v-model="validForm" lazy-validation>
            <crud-form :record="record" :parentId="parentId" :storeName="storeName" />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :fab="fab" :dark="!dark" :light="dark" @click.native="closeCrudForm"><v-icon>reply</v-icon></v-btn>
              <v-btn :fab="fab" :dark="!dark" :light="dark" v-if="canDelete && record.id" @click.native="crudFormDelete"><v-icon>delete</v-icon></v-btn>
              <v-btn :fab="fab" :dark="!dark" :light="dark" v-if="canUpdate && record.id||canCreate && !record.id" :disabled="!validForm" @click.native="crudFormSave"><v-icon>done_all</v-icon></v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-end>
      <v-btn v-if="parentId && showGoBack" :fab="fab" top :dark="!dark" :light="dark" @click.stop="goBack" :disabled="loading"><v-icon>reply</v-icon></v-btn>
      <v-btn v-if="canCreate" :fab="fab" top :dark="!dark" :light="dark" @click.stop="addrowCreate?inlineCreate():crudFormOpen(null)" :disabled="loading"><v-icon>add</v-icon></v-btn>
      <v-btn v-if="crudOps.export" :fab="fab" top :dark="!dark" :light="dark" @click.stop="exportBtnClick" :disabled="loading"><!-- handle disabled FAB in Vuetify -->
        <v-icon :class='[{"white--text": !loading }]'>print</v-icon>
      </v-btn>
    </v-layout>

    <v-snackbar v-if="crudSnackBar" v-model="snackbar" v-bind="crudSnackBar">
      {{ snackbarText }}
      <v-btn fab flat @click="snackbar=false"><v-icon >close</v-icon></v-btn>
    </v-snackbar>
  </v-container>
</template>

<style lang="css" scoped>
/* should no longer need to make nested table a modal */
.make-modal-disabled {
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
</style>
