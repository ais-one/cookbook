<script>
// Notes:
// IMPORTANT - important point to take not of
// TBD - to be done
// TOREMOVE - to be removed
//
// TBD
// 1) to consider: expand, select & select-all item-key="id"
// 2) user access control to operations

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
    this.inlineButtons = this.crudTable.inlineButtons !== false // default true

    // is there an action column
    this.actionColumn = this.crudTable.actionColumn === true // default false
    if (this.actionColumn) { // WARNING what if this.crudTable.headers undefined or wrong?
      this.headers = [{ text: this.$t('vueCrudX.actions'), value: 'id', sortable: false }, ...this.crudTable.headers]
    } else {
      this.headers = this.crudTable.headers
    }

    // check if components and datas are present
    this.formAutoData = (this.isObject(this.crudForm.formAutoData)) ? this.crudForm.formAutoData : null
    this.hasFormVue = typeof this.crudForm.FormVue === 'function' || this.formAutoData
    this.hasFilterData = this.isObject(this.crudFilter.filterData)
    this.hasFilterVue = typeof this.crudFilter.FilterVue === 'function'

    // use add row to create record
    this.addrowCreate = this.crudTable.addrowCreate === true // default false

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
    this.fullscreenForm = this.crudTable.fullscreenForm === true // form full screen? - default false
    this.onCreatedOpenForm = this.crudTable.onCreatedOpenForm === true // open form on create, default false

    // some styling
    this.hideHeaders = this.crudTable.hideHeaders === true // default false
    this.isFluid = this.crudTable.isFluid !== false // default true
    this.dark = !!this.$attrs.dark // from router-view?
    this.fab = this.$attrs.fab !== false // default true
    this.noDataColor = this.crudTable.noDataColor || 'grey'
    this.formToolbarColor = this.crudTable.formToolbarColor || 'grey'
    this.filterHeaderColor = this.crudTable.filterHeaderColor || 'grey'

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
    if (!this.hasFilterVue) {
      for (var key in this.filterData) {
        if (this.filterData[key].itemsFn) this.filterData[key].items = await this.filterData[key].itemsFn()
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
      fullscreenForm: false,

      // filter
      validFilter: true,
      hasFilterVue: false,
      hasFilterData: false,

      // data-table
      loading: false,
      inlineValue: null, // temporarily storing inline  edit values

      // crudTable
      headers: [ ], // pass in
      inline: false, // inline editing
      inlineButtons: true, // has save and cancel buttons

      actionColumn: false,
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
      noDataColor: 'grey',
      formToolbarColor: 'grey',
      filterHeaderColor: 'grey',

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
      return true
    },
    isObject (obj) { return obj !== null && typeof obj === 'object' },
    setSnackBar (statusCode) {
      if (this.crudSnackBar && statusCode) {
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
      // TOREMOVE why was this here in the first place? await this.getRecords()
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
      if (item[field] !== this.inlineValue) {
        const rv = await this.updateRecord({ record: item })
        if (!rv) item[field] = this.inlineValue // if false undo changes
      } // else console.log('no changes')
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
      if (!this.actionColumn && this.onRowClickOpenForm) this.crudFormOpen(item.id) // no action column && row click opens form
      if (!this.inline) this.$emit('selected', { item, event }) // emit 'selected' event with following data {item, event}, if inline
    }
  }
}
</script>

<template>
  <v-container v-bind:class="{ 'make-modal': parentId }" :fluid="isFluid">
    <v-expansion-panel>
      <v-expansion-panel-content :class="filterHeaderColor">
        <div slot="header" ><v-icon>search</v-icon> {{showTitle | capitalize}} {{ doPage ? '' : ` - ${records.length} Records` }}</div>
        <v-form v-if="hasFilterData" class="grey lighten-3 pa-2" v-model="validFilter" ref="searchForm" lazy-validation>
          <crud-filter v-if="hasFilterVue" :filterData="filterData" :parentId="parentId" :storeName="storeName" />
          <v-layout row wrap v-else>
            <v-flex v-for="(filter, index) in filterData" :key="index" :sm6="filter.halfSize" xs12 class="pa-2">
              <component v-if="filter.type === 'select'" :is="'v-select'" v-model="filter.value" :multiple="filter.multiple" :label="filter.label" :items="filter.items" :rules="filter.rules"></component>
              <component v-if="filter.type === 'select-kv'" :is="'v-select'" v-model="filter.value" :multiple="filter.multiple" :label="filter.label" :items="filter.items" :rules="filter.rules" item-value="value" item-text="text" return-object></component>
              <component v-if="filter.type === 'date'" :is="'v-text-field'" v-model="filter.value" :label="filter.label" :rules="filter.rules" type="date"></component>
              <component v-if="filter.type === 'text'" :is="'v-text-field'" v-model="filter.value" :label="filter.label" :rules="filter.rules" :clearable="!!filter.clearable" type="text"></component>
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
      :hide-actions="!doPage"
      :hide-headers="hideHeaders"
      :dark="dark"
      :light="!dark"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <!-- tr @click.stop="(e) => crudFormOpen(e, props.item.id, $event)" AVOID ARROW fuctions -->
        <tr @click.stop="rowClicked(props.item, $event)">
          <td v-if="actionColumn" class="justify-center layout" valign="middle">
            <v-icon v-if="canUpdate" small class="mr-2" @click.stop="crudFormOpen(props.item.id)" :disabled="loading">edit</v-icon>
            <v-icon v-if="canDelete" small class="mr-2" @click.stop="inlineDelete(props.item.id)" :disabled="loading">delete</v-icon>
          </td>
          <!-- for now, lighten (grey lighten-4) editable columns until fixed header is implemented -->
          <td :key="header.value" v-for="(header, index) in headers"  v-if="actionColumn?index>0:index>=0" :class="{ 'grey lighten-4': (inline[header.value] && crudOps.update) }">
            <v-edit-dialog
              v-if="(inline[header.value]==='textarea'||inline[header.value]==='date'||inline[header.value]==='textdialog') && crudOps.update"
              :return-value.sync="props.item[header.value]"
              :large="inlineButtons"
              :persistent="inlineButtons"
              lazy
              :cancel-text="$t('vueCrudX.save')"
              :save-text="$t('vueCrudX.cancel')"
              @save="inlineUpdate(props.item, header.value)"
              @cancel="()=>{}"
              @open="inlineOpen(props.item[header.value])"
              @close="()=>{}"
              fixed-header
            >
              <div>{{ props.item[header.value] }}</div>
              <!-- <div slot="input" class="mt-3 title">Update Field</div> -->
              <component
                :is="inline[header.value]==='textarea'?'v-textarea':(inline[header.value]==='date')?'v-date-picker':'v-text-field'"
                slot="input"
                v-model="props.item[header.value]"
                label=""
                :type="inline[header.value]"
                single-line
                counter
                autofocus
              >
              </component>
            </v-edit-dialog>
            <v-text-field
              v-else-if="inline[header.value]==='text' && crudOps.update"
              class="caption"
              type="text"
              v-model="props.item[header.value]"
              @focus="inlineOpen(props.item[header.value])"
              @blur="inlineUpdate(props.item, header.value)"
            />
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
          <v-alert :value="true" :color="noDataColor" icon=""><v-icon>warning</v-icon> {{$t?$t('vueCrudX.noData'):'NO DATA'}}</v-alert>
        </v-flex>
      </template>
    </v-data-table>

    <v-layout row justify-center>
      <v-dialog v-model="crudFormFlag" :fullscreen="fullscreenForm" scrollable transition="dialog-bottom-transition" :overlay="false">
        <v-card>
          <v-toolbar :dark="!dark" :light="dark" :color="formToolbarColor">
            <v-toolbar-title><v-icon>mode_edit</v-icon> {{showTitle | capitalize}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items></v-toolbar-items>
          </v-toolbar>
          <v-progress-linear :indeterminate="loading" height="2"></v-progress-linear>

          <v-form v-if="hasFormVue" class="grey lighten-3 pa-2" v-model="validForm" lazy-validation>
            <crud-form v-if="!formAutoData" :record="record" :parentId="parentId" :storeName="storeName" />
            <v-layout row wrap v-else>
              <v-flex v-for="(form, objKey, index) in formAutoData" :key="index" :sm6="form.halfSize" xs12 class="pa-2">
                <component v-if="form.type === 'select'" :is="'v-select'" v-model="record[objKey]" :multiple="form.multiple" :label="form.label" :items="form.items" :rules="form.rules"></component>
                <component v-if="form.type === 'select-kv'" :is="'v-select'" v-model="record[objKey]" :multiple="form.multiple" :label="form.label" :items="form.items" :rules="form.rules" item-value="value" item-text="text" return-object></component>
                <component v-if="form.type === 'date'" :is="'v-text-field'" v-model="record[objKey]" :label="form.label" :rules="form.rules" type="date"></component>
                <component v-if="form.type === 'text'" :is="'v-text-field'" v-model="record[objKey]" :label="form.label" :rules="form.rules" type="text"></component>
              </v-flex>
            </v-layout>

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
/* fixed-header - not working yet
https://github.com/vuetifyjs/vuetify/issues/1547#issuecomment-418698573
*/
</style>
