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
      },
      locale: 'en' // for multi-language
    },
    getters: {
      record (state) { return state.record },
      records (state) { return state.records },
      totalRecs (state) { return state.totalRecs },
      filterData (state) { return state.filterData },
      pagination (state) { return state.pagination },
      defaultRec (state) { return state.defaultRec },
      crudOps (state) { return state.crudOps },
      locale (state) { return state.locale }
    },
    mutations: {
      setRecords (state, payload) {
        state.records = payload.records
        state.totalRecs = payload.totalRecs
      },
      setRecord (state, payload) {
        state.record = (payload !== undefined) ? payload : state.defaultRec
      },
      setLocale (state, payload) { state.locale = payload },
      setPagination (state, payload) { state.pagination = payload },
      setFilterData (state, payload) { state.filterData = payload }
    },
    actions: { // Edit Actions
      setLocale ({commit}, payload) {
        commit('setLocale', payload)
      },
      setPagination ({commit}, payload) {
        commit('setPagination', payload)
      },
      async deleteRecord ({commit, getters}, payload) {
        payload.user = this.getters.user
        await getters.crudOps.delete(payload)
      },
      async getRecord ({commit, getters}, payload) {
        payload.user = this.getters.user
        console.log('getRecord', this)
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
        await getters.crudOps.update(payload)
      },
      async createRecord ({commit, getters, dispatch}, payload) {
        payload.user = this.getters.user
        await getters.crudOps.create(payload)
      }
    }
  }

  export default {
    props: {
      parentId: {
        type: String,
        default: null
      },
      storeName: {
        type: String,
        required: true
      },
      crudFilter: {
        type: Object,
        required: true
      },
      crudTable: {
        type: Object,
        required: true
      },
      crudForm: {
        type: Object,
        required: true
      },
      crudOps: {
        type: Object,
        required: true
      },
      crudTitle: {
        type: String,
      },
      doPage: {
        type: Boolean,
        default: true
      }
    },
    created () {
      // console.log('CRUD component created', this, this.parentId)
      const store = this.$store
      const name = this.storeName
      if (!(store && store.state && store.state[name])) { // register a new module only if doesn't exist
        store.registerModule(name, _cloneDeep(CrudStore)) // make sure its a deep clone
        store.state[name].defaultRec = this.crudForm.defaultRec
        store.state[name].filterData = this.crudFilter.filterData
        store.state[name].crudOps = this.crudOps
        // console.log(`register module: ${name}`)
      } else { // re-use the already existing module
        // console.log(`reusing module: ${name}`)
      }

      this.$options.filters.formatters = this.crudTable.formatters // create the formatters programatically
      this.headers = this.crudTable.headers
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
        confirmDialogFlag: false,
        confirmDialogText: 'Would you like to proceed?',
        validForm: true,

        // filter
        validFilter: true,

        // data-table
        loading: true,
        headers: { } // pass in
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
      async getRecords (payload) { await this.$store.dispatch(this.storeName + '/getRecords', payload) },
      setPagination (payload) { this.$store.dispatch(this.storeName + '/setPagination', payload) },
      async deleteRecord (payload) { await this.$store.dispatch(this.storeName + '/deleteRecord', payload) },
      async updateRecord (payload) { await this.$store.dispatch(this.storeName + '/updateRecord', payload) },
      async createRecord (payload) { await this.$store.dispatch(this.storeName + '/createRecord', payload) },
      async getRecord (payload) { await this.$store.dispatch(this.storeName + '/getRecord', payload) },
      setRecord (payload) { this.$store.commit(this.storeName + '/setRecord', payload) },
      async exportRecords (payload) { await this.$store.dispatch(this.storeName + '/exportRecords', payload) },

      closeAddEditDialog () {
        this.addEditDialogFlag = false
        this.setRecord()
      },
      async addEditDialogOpen (id) {
        if (id) { // edit
          await this.getRecord({id})
        } else { // add
          this.setRecord()
        }
        this.addEditDialogFlag = true
      },
      async addEditDialogSave (e) {
        if (this.record.id !== null) {
          await this.updateRecord({record: this.record})
        } else {
          await this.createRecord({record: this.record, parentId: this.parentId})
        }
        await this.getRecordsHelper()
        this.closeAddEditDialog()
      },
      addEditDialogDelete (e) {
        this.confirmDialogFlag = true
        this.addEditDialogFlag = false
      },
      async dialogConfirm (e) { // only for delete for now
        const {id} = this.record
        if (id != null) {
          await this.deleteRecord({id})
          await this.getRecordsHelper()
        }
        this.setRecord()
        this.confirmDialogFlag = false
      },
      dialogAbort (e) {
        this.confirmDialogFlag = false
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
      goBack () {
        this.$router.back()
      }
    }
  }
</script>

<template>
  <v-container v-bind:class="{ 'make-modal': parentId }">
    <v-expansion-panel>
      <v-expansion-panel-content class="grey lighten-1">
        <div slot="header" >{{showTitle | capitalize}} - Search</div>
        <v-form class="grey lighten-3 pa-2" v-model="validFilter" ref="searchForm" lazy-validation>
          <crud-filter :filterData="filterData" :parentId="parentId" :storeName="storeName" />
          <v-btn @click="submitFilter" :disabled="!validFilter || loading">apply</v-btn>
          <!-- v-btn @click="clearFilter">clear</v-btn -->
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
        <tr ref="props.item" @click.stop="addEditDialogOpen(props.item.id)">
          <td :key="header.value" v-for="header in headers">{{ props.item[header.value] | formatters(header.value) }}</td>
        </tr>
        <!-- v-edit-dialog : Currently No Inline Editing -->
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          Sorry, nothing to display here :(
        </v-alert>
      </template>
    </v-data-table>

    <v-layout row justify-center>
      <v-dialog v-model="confirmDialogFlag" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Confirmation</v-card-title>
          <v-card-text>{{ confirmDialogText }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="dialogConfirm">Yes</v-btn>
            <v-btn color="green darken-1" flat @click.native="dialogAbort">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addEditDialogFlag" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
          <v-toolbar dark color="primary">
            <v-toolbar-title>Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items></v-toolbar-items>
            <v-btn icon @click.native="closeAddEditDialog" dark><v-icon>close</v-icon></v-btn>
          </v-toolbar>
          <v-form class="grey lighten-3 pa-2" v-model="validForm" lazy-validation>
            <crud-form :record="record" :parentId="parentId" :storeName="storeName" />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn v-if="record.id && this.crudOps.delete" color="red darken-1" flat @click.native="addEditDialogDelete">Delete</v-btn>
              <v-btn color="blue darken-1" :disabled="!validForm" flat @click.native="addEditDialogSave">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-btn v-if="this.parentId" fab top color="blue" dark @click.stop="goBack"><v-icon>reply</v-icon></v-btn>
    <v-btn v-if="this.crudOps.create" fab top color="pink" dark @click.stop="addEditDialogOpen()"><v-icon>add</v-icon></v-btn>
    <v-btn v-if="this.crudOps.export" fab top color="green" @click.stop="exportBtnClick()" :disabled="loading"><!-- handle disabled FAB in Vuetify -->
      <v-icon :class='[{"white--text": !loading }]'>print</v-icon>
    </v-btn>
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
