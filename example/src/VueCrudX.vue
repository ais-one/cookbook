<script>
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
    setPagination ({commit}, payload) {
      commit('setPagination', payload)
    },
    async deleteRecord ({commit, getters}, payload) {
      payload.user = this.getters.user
      let res = await getters.crudOps.delete(payload)
      return res
    },
    async getRecord ({commit, getters}, payload) {
      payload.user = this.getters.user
      let record = await getters.crudOps.findOne(payload)
      commit('setRecord', record)
    },
    async getRecords ({commit, getters}, payload) {
      payload.user = this.getters.user
      let {records, pagination} = await getters.crudOps.find(payload)
      const totalRecs = records.length
      commit('setPagination', pagination)
      commit('setFilterData', payload.filterData)
      commit('setRecords', {records, totalRecs})
    },
    async exportRecords ({commit, getters}, payload) {
      payload.user = this.getters.user
      await getters.crudOps.export(payload)
    },
    async updateRecord ({commit, getters}, payload) {
      payload.user = this.getters.user
      let res = await getters.crudOps.update(payload)
      return res
    },
    async createRecord ({commit, getters, dispatch}, payload) {
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
    crudTitle: { type: String },
    doPage: { type: Boolean, default: true },
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
    this.headers = this.crudTable.headers || { }
    this.inline = this.crudTable.inline || false
    this.confirmCreate = this.crudTable.confirmCreate || false
    this.confirmUpdate = this.crudTable.confirmUpdate || false
    this.confirmDelete = this.crudTable.confirmDelete || false
    this.$options.components['crud-filter'] = this.crudFilter.FilterVue
    this.$options.components['crud-form'] = this.crudForm.FormVue
    if (this.record.id && !this.parentId) { // nested CRUD
      this.addEditDialogFlag = true
    }
  },
  beforeUpdate () { },
  mounted () { },
  beforeRouteEnter (to, from, next) { next(vm => { }) },
  data () {
    return {
      // form
      addEditDialogFlag: false,
      validForm: true,
      // filter
      validFilter: true,
      // data-table
      loading: false,
      headers: { }, // pass in
      inline: false, // inline editing
      confirmCreate: false, // confirmation required flags
      confirmUpdate: false,
      confirmDelete: true,
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
    }
  },
  methods: {
    setSnackBar (text) {
      if (this.crudSnackBar) {
        this.snackbar = true
        this.snackbarText = text
      }
    },
    async getRecords (payload) { await this.$store.dispatch(this.storeName + '/getRecords', payload) },
    setPagination (payload) { this.$store.dispatch(this.storeName + '/setPagination', payload) },
    async deleteRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/deleteRecord', payload)
      this.loading = false
      if (res) this.setSnackBar(res)
    },
    async updateRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/updateRecord', payload)
      this.loading = false
      if (res) this.setSnackBar(res)
    },
    async createRecord (payload) {
      this.loading = true
      let res = await this.$store.dispatch(this.storeName + '/createRecord', payload)
      this.loading = false
      if (res) this.setSnackBar(res)
    },
    async getRecord (payload) {
      this.loading = true
      await this.$store.dispatch(this.storeName + '/getRecord', payload)
      this.loading = false
    },
    setRecord (payload) { this.$store.commit(this.storeName + '/setRecord', null) },
    async exportRecords (payload) { await this.$store.dispatch(this.storeName + '/exportRecords', payload) },
    closeAddEditDialog () {
      this.addEditDialogFlag = false
    },
    async addEditDialogOpen (id) {
      if (id) await this.getRecord({id}) // edit
      else this.setRecord() // add
      this.addEditDialogFlag = true
    },
    async addEditDialogSave (e) {
      if (this.record.id && this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      if (!this.record.id && this.confirmUpdate) if (!confirm(this.$t('vueCrudX.confirm'))) return

      if (this.record.id) await this.updateRecord({record: this.record})
      else await this.createRecord({record: this.record, parentId: this.parentId})
      await this.getRecordsHelper()
      this.closeAddEditDialog()
    },
    async addEditDialogDelete (e) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      const {id} = this.record
      if (id) {
        await this.deleteRecord({id})
        await this.getRecordsHelper()
      }
      this.closeAddEditDialog()
    },
    async getRecordsHelper () {
      this.loading = true
      await this.getRecords({
        pagination: this.pagination,
        filterData: this.filterData,
        parentId: this.parentId
      })
      this.loading = false
    },
    async submitFilter () {
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
    // clearFilter () { // can do test code here too
    //   this.$refs.searchForm.reset()
    // },
    goBack () { this.$router.back() },
    // inline
    inlineCancel () { }, // do nothing for now
    inlineOpen () { },
    inlineClose () { },
    async inlineSave (item) { // set snackback
      if (this.confirmUpdate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.updateRecord({record: item})
    },
    async inlineCreate () {
      if (this.confirmCreate) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.createRecord({record: (typeof this.crudForm.defaultRec === 'function') ? this.crudForm.defaultRec() : this.crudForm.defaultRec, parentId: this.parentId})
      this.$nextTick(async function () { await this.getRecordsHelper() })
    },
    async inlineDelete (id) {
      if (this.confirmDelete) if (!confirm(this.$t('vueCrudX.confirm'))) return
      await this.deleteRecord({id})
      this.$nextTick(async function () { await this.getRecordsHelper() })
    }
  }
}
</script>

<template>
  <v-container v-bind:class="{ 'make-modal': parentId }">
    <v-expansion-panel>
      <v-expansion-panel-content class="grey lighten-1">
        <div slot="header" ><v-icon>search</v-icon> {{showTitle | capitalize}} {{ doPage ? '' : ` - ${records.length} Records` }}</div>
        <v-form class="grey lighten-3 pa-2" v-model="validFilter" ref="searchForm" lazy-validation>
          <crud-filter :filterData="filterData" :parentId="parentId" :storeName="storeName" />
          <v-layout row justify-end>
            <!-- v-btn fab @click="clearFilter"><v-icon>close</v-icon></v-btn -->
            <v-btn fab @click="submitFilter" :disabled="!validFilter || loading"><v-icon>replay</v-icon></v-btn>
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
      :hide-actions=!doPage
    >
      <template slot="items" slot-scope="props">
        <!-- tr @click.stop="(e) => addEditDialogOpen(e, props.item.id, $event)" AVOID ARROW fuctions -->
        <tr v-if="!inline" @click.stop="addEditDialogOpen(props.item.id)">
          <td :key="header.value" v-for="header in headers">{{ props.item[header.value] | formatters(header.value) }}</td>
        </tr>
        <tr v-else>
          <!-- for now, lighten (grey lighten-4) editable columns until fixed header is implemented -->
          <td :key="header.value" v-for="header in headers" :class="{ 'grey lighten-4': (inline[header.value] && crudOps.update) }">
            <v-edit-dialog v-if="inline[header.value] && crudOps.update"
              :return-value.sync="props.item[header.value]"
              large
              lazy
              persistent
              @save="inlineSave(props.item)"
              @cancel="inlineCancel"
              @open="inlineOpen"
              @close="inlineClose"
            >
              <div>{{ props.item[header.value] }}</div>
              <div slot="input" class="mt-3 title">Update Field</div>
              <v-text-field slot="input" v-model="props.item[header.value]" label="Edit" :type="inline[header.value]" single-line counter autofocus></v-text-field>
            </v-edit-dialog>
            <span v-else>{{ props.item[header.value] | formatters(header.value) }}</span>
          </td>
          <td>
            <v-btn v-if="crudOps.delete" @click.native="inlineDelete(props.item.id)"><v-icon>delete</v-icon></v-btn>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <v-flex class="text-xs-center">
          <v-alert :value="true" color="error" icon=""><v-icon>warning</v-icon> {{$t?$t('vueCrudX.noData'):'NO DATA'}}</v-alert>
        </v-flex>
      </template>
    </v-data-table>

    <v-layout row justify-center>
      <v-dialog v-model="addEditDialogFlag" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title><v-icon>mode_edit</v-icon> {{showTitle | capitalize}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items></v-toolbar-items>
          </v-toolbar>
          <v-progress-linear :indeterminate="loading" height="2"></v-progress-linear>
          <v-form class="grey lighten-3 pa-2" v-model="validForm" lazy-validation>
            <crud-form :record="record" :parentId="parentId" :storeName="storeName" />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn fab @click.native="closeAddEditDialog" dark><v-icon>reply</v-icon></v-btn>
              <v-btn fab v-if="record.id && crudOps.delete" dark @click.native="addEditDialogDelete"><v-icon>delete</v-icon></v-btn>
              <v-btn fab v-if="(record.id && crudOps.update) || (!record.id && crudOps.create)" :disabled="!validForm" @click.native="addEditDialogSave"><v-icon>done_all</v-icon></v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout row justify-end>
      <v-btn v-if="parentId" fab top dark @click.stop="goBack" :disabled="loading"><v-icon>reply</v-icon></v-btn>
      <v-btn v-if="crudOps.create" fab top dark @click.stop="inline?inlineCreate():addEditDialogOpen(null)" :disabled="loading"><v-icon>add</v-icon></v-btn>
      <v-btn v-if="crudOps.export" fab top dark @click.stop="exportBtnClick" :disabled="loading"><!-- handle disabled FAB in Vuetify -->
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
</style>
