<template>
  <div>
    <vcxwc-loading-overlay v-if="loading"></vcxwc-loading-overlay>
    <div class="container" v-show="!showForm">
      <nav class="navbar">
        <ul class="nav-left">
          <li class="nav-item"><mwc-icon-button icon="search" @click="showFilter=!showFilter"></mwc-icon-button></li>
          <li class="nav-item"><mwc-icon-button icon="refresh" @click="refreshData" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item" v-if="tableCfg && tableCfg.create"><mwc-icon-button icon="add" @click="openAdd" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item" v-if="tableCfg && tableCfg.delete"><mwc-icon-button icon="delete" @click="remove" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item"><mwc-icon-button icon="post_add" @click="csvImport" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item"><mwc-icon-button icon="move_to_inbox"  @click="csvExport" :disabled="loading"></mwc-icon-button></li>
          <li v-if="keycol" class="nav-item"><mwc-icon-button icon="reply"  @click="goBack" :disabled="loading"></mwc-icon-button></li>
        </ul>
        <ul class="nav-right">
          <li class="nav-item">
            <select class="nav-select-page-size" v-model="rowsPerPage">
              <option v-for="val of rowsPerPageList" :key="val" :value="val" :selected="val === rowsPerPage" >{{ val }}</option>
            </select>
          </li>
          <li class="nav-item">
            <input class="nav-select-page" type="number" v-model="page" min="1" :max="maxPage" /> / {{ maxPage }}
          </li>
        </ul>
      </nav>

      <template v-if="showFilter">
        <slot name="filters" :filters="filters" :filterCols="filterCols" :filterOps="filterOps">
          <div v-if="filters.length">
            <div class="filter-row" v-for="(filter, index) of filters" :key="index">
              <select class="filter-col" v-model="filter.col">
                <option v-for="(col, index1) of filterCols" :value="col" :key="'c'+index+'-'+index1">{{ col }}</option>
              </select>
              <select class="filter-col" v-model="filter.op">
                <option v-for="(col, index2) of filterOps" :value="col" :key="'o'+index+'-'+index2">{{ col }}</option>
              </select>
              <input placeholder="Value" class="filter-col" v-model="filter.val" />
              <select class="filter-col" v-model="filter.andOr">
                <option value="and">And</option>
                <option value="or">Or</option>
              </select>
              <button class="filter-col" @click="deleteFilter(index)">x</button>
              <button class="filter-col" @click="addFilter(index + 1)">+</button>
            </div>
          </div>
          <div v-else>
            <div class="filter-row">
              <button class="filter-col" @click="addFilter(0)">+</button>
            </div>
          </div>
        </slot>
      </template>

      <slot name="table"
        :tableCfg="tableCfg"
        :headerCols="headerCols" 
        :page="page"
        :records="records"
        :rowsPerPage="rowsPerPage"
        :maxPage="maxPage"
      >
        <vaadin-grid class="table">
          <vaadin-grid-selection-column v-if="tableCfg && tableCfg.multiSelect" @select-all-changed="selectAllChanged"></vaadin-grid-selection-column>
          <vaadin-grid-sort-column v-for="(headerCol, index) in headerCols" :key="index" :path="headerCol.path" :header="headerCol.header"></vaadin-grid-sort-column>
        </vaadin-grid>
      </slot>
    </div>

    <div class="page-flex" v-if="showForm && tableCfg">
      <slot name="form" :tableCfg="tableCfg" :recordObj="recordObj" :showForm="showForm">
        <form class="form-box-flex">
          <p>{{ showForm !== 'add' ? 'Edit' : 'Add' }}</p>
          <div class="field-set-flex">
            <template v-for="(val, col, index) of recordObj[showForm]">
              <template v-if="tableCfg.cols[col]">
                <template v-if="tableCfg.cols[col].input==='link'">
                  <mwc-textfield @click="router.push('/'+tableCfg.cols[col].options.to+'?keyval='+recordObj[showForm].key+'&keycol='+tableCfg.cols[col].options.relatedCol)" disabled class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="text" v-model="recordObj[showForm][col]"></mwc-textfield>
                </template>
                <template v-else-if="tableCfg.cols[col][showForm]==='readonly'">
                  <mwc-textfield disabled class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="text" v-model="recordObj[showForm][col]"></mwc-textfield>
                </template>
                <template v-else-if="tableCfg.cols[col].input==='number'">
                  <mwc-textfield :required="isRequired(col)" class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="number" v-model="recordObj[showForm][col]"></mwc-textfield>
                </template>           
                <template v-else-if="tableCfg.cols[col].input==='datetime'">
                  <mwc-textfield :required="isRequired(col)" class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="datetime-local" v-model="recordObj[showForm][col]"></mwc-textfield>
                </template>           
                <template v-else-if="tableCfg.cols[col].input==='date'">
                  <mwc-textfield :required="isRequired(col)" class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="date" v-model="recordObj[showForm][col]"></mwc-textfield>
                </template>           
                <template v-else-if="tableCfg.cols[col].input==='time'">
                  <mwc-textfield :required="isRequired(col)" class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="time" v-model="recordObj[showForm][col]"></mwc-textfield>
                </template>
                <template v-else-if="tableCfg.cols[col].input==='select'">
                  <mwc-select :key="col+index" :label="tableCfg.cols[col].label" :value="recordObj[showForm][col]" @change="(e) => recordObj[showForm][col] = e.target.value">
                    <mwc-list-item v-for="(option, index2) of tableCfg.cols[col].options" :value="option.key" :key="col+index+'-'+index2">{{ option.text }}</mwc-list-item>
                  </mwc-select>
                </template>
                <template v-else-if="tableCfg.cols[col].input==='multi-select'">
                  <mwc-multiselect
                    :required="isRequired(col)"
                    :key="col+index"
                    :label="tableCfg.cols[col].label"
                    v-model="recordObj[showForm][col]"
                    :options="JSON.stringify(tableCfg.cols[col].options)"
                  ></mwc-multiselect>
                </template>
                <template v-else-if="tableCfg.cols[col].input==='autocomplete'">
                  <mwc-autocomplete
                    :class="col"
                    :required="isRequired(col)"
                    :key="col+index"
                    :label="tableCfg.cols[col].label"
                    v-model="recordObj[showForm][col]"
                    @search="(e) => autoComplete(e, col, showForm)"
                  ></mwc-autocomplete>
                </template>           
                <template v-else>
                  <mwc-textfield :required="isRequired(col)" class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="text" v-model="recordObj[showForm][col]"></mwc-textfield>
                </template>           
              </template>
            </template>
          </div>
          <mwc-button type="button" @click="showForm=''">Cancel</mwc-button>
          <mwc-button type="button" @click="doAddOrEdit" :disabled="loading">Confirm</mwc-button>
        </form>
      </slot>
    </div>
  </div>
</template>

<script>
// TBD handle single select / multi select - _rowClick()
// TBD handle if !tableName - onMounted()
// TBD handle if cannot get config
// TBD handle if cannot load data
// TBD show all...
// TBD inline edits
// TBD table columns with joined values, virtual columns...
import { debounce } from '../lib/esm/util.js'
import { validate } from '../lib/esm/validate.js'
import { httpGet, httpPost, httpPatch } from '../lib/esm/http.js'

import { onMounted, ref, reactive, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'CrudTable',
  props: {
    rowsPerPage: { type: [Number], default: 10 },
    rowsPerPageList: { type: Array, default: [5, 10, 25, 50] },
    tableName: { type: String, required: true }
  },
  // do NOT destructure the props object, as it will lose reactivity
  setup(props, ctx) { // ctx = attrs, slots, emit
    const router = useRouter()
    const route = useRoute()
    const keycol = ref(null) // parent key/id name here
    const keyval = ref(null) // parent key/id value
    const tableCfg = ref(null) // table config
    const page = ref(1)
    const records = ref([])
    const maxPage = ref(1)
    const rowsPerPage = ref(props.rowsPerPage)
    const headerCols = reactive([])
    const filters = reactive([])
    const filterCols = reactive([])
    const filterOps = ref(['=', 'like', '!=', '>=', '>', '<=', '<'])
    const showFilter = ref(false)
    const showForm = ref('') // '', add, edit
    const loading = ref(false)
    const recordObj = reactive({
      add: {},
      edit: {},
    })
    const tableName = props.tableName
    let gridEl // grid element

    const _rowClick = async (e) => {
      // console.log('click not on checkbox 1', e.detail.value)
      const item = e.detail.value
      e.stopPropagation()
      if (loading.value) return // return if something is processing
      if (!tableCfg.value.update) return console.log('no update permission')

      if (!item && tableCfg.value.multiSelect) return console.log('click item null')

      if (tableCfg.value.multiSelect) {
        gridEl.activeItem = null
      } else {
        console.log('single')
        gridEl.selectedItems = item ? [item] : []
      }
      if (!item) return // do not continue if item is null
      try {
        console.log('item.key', item.key)
        const rv = await httpGet('/api/t4t/find-one/' + tableName, { key: item.key })
        recordObj['edit'].key = item.key
        Object.entries(tableCfg.value.cols).forEach(kv => {
          const [key, val] = kv
          if (val.edit !== 'hide') {
            recordObj['edit'][key] = rv[key]
          }
        })
        showForm.value = 'edit'
      } catch (err) {
        console.log(err.toString())
      }
    }

    // const _selectClick = async (e) => console.log('click on checkbox', e.detail.value)

    // gridEl.addEventListener('dblclick', _dblClick)
    // const _dblClick = (e) => {
    //   const item = gridEl.getEventContext(e).item
    //   gridEl.selectedItems = gridEl.selectedItems[0] === item ? [] : [item]
    //   e.stopPropagation()
    // }

    onMounted(async () => {
      console.log('Crud Table route', route.query)
      keycol.value = route.query.keycol
      keyval.value = route.query.keyval

      if (!tableCfg.value) tableCfg.value = await httpGet('/api/t4t/config/' + tableName)
      if (tableCfg.value) {
        for (let col in tableCfg.value.cols) {
          const obj = tableCfg.value.cols[col]
          if (obj.table !== 'hide') headerCols.push({ path: col, header: obj.label }) // process table columns
          if (obj.filter !== 'hide') filterCols.push(col) // process filters
        }
        // Object.entries(tableCfg.value.cols) => [ [key, obj], ... ]        
      }

      gridEl = document.querySelector('vaadin-grid.table')
      if (gridEl) {
        gridEl.addEventListener('active-item-changed', _rowClick)
        // gridEl.addEventListener('selected-items-changed', _selectClick)

        // https://vaadin.com/forum/thread/17445015/updating-grid-data-directly-when-using-dataprovider
        gridEl.dataProvider = async function (params, callback) {
          if (loading.value) return
          loading.value = true
          // console.log('grid.dataProvider', params)
          try {
            const sorter = []
            if (params.sortOrders && params.sortOrders.length && params.sortOrders[0].direction) {
              sorter.push({
                column: params.sortOrders[0].path,
                order: params.sortOrders[0].direction
              })
            }

            gridEl.selectedItems = []
            if (keycol.value) filters.push( { col: keycol.value, op: "=", val: keyval.value, andOr: "and"} )
            const rv = await httpGet('/api/t4t/find/' + tableName, {
              page: page.value,
              limit: rowsPerPage.value,
              filters: JSON.stringify(filters),
              sorter: JSON.stringify(sorter)
            })
            if (rv.results) {
              // console.log('rv.total', rv.total, rv.results)
              maxPage.value = Math.ceil(rv.total / rowsPerPage.value)
              // gridEl.items = rv.results // do not use this, not scalable
              gridEl.size = rv.total
              records.value = rv.results
              callback(rv.results)
            }
          } catch (e) {
            console.log(e.toString())
          }
          loading.value = false
        }
      }
    })
    onUnmounted(()=> {
      if (gridEl) {
        gridEl.removeEventListener('active-item-changed', _rowClick)
        // gridEl.removeEventListener('selected-items-changed', _selectClick)
      }
    })

    const isRequired = (col) => {
      const { required, multiKey } = tableCfg.value.cols[col]
      return required || multiKey
    }

    const refreshData = () => gridEl.clearCache()

    const openAdd = async () => {
      Object.entries(tableCfg.value.cols).forEach(item => {
        const [key, val] = item
        if (val.add !== 'hide') {
          recordObj['add'][key] = val.default || (val.type === 'integer' || val.type === 'decimal' ? 0 : '')
        }
      })
      showForm.value = 'add'
    }

    const autoComplete = debounce(async (e, col, _showForm) => {
      let res = []
      recordObj[_showForm][col] = e.target.value
      try {
        const { dbName, tableName, limit, key, text, parentTableColName, parentCol } = tableCfg.value.cols[col].options
        const query = { dbName, tableName, limit, key, text, search: e.target.value }
        if (parentTableColName) {
          query['parentTableColName'] = parentTableColName
          query['parentTableColVal'] = recordObj[_showForm][parentCol]
        }
        // recordObj[_showForm+'Ac'][col] = await httpGet('/api/t4t/autocomplete', query)
        res = await httpGet('/api/t4t/autocomplete', query)
      } catch (err) {
        // recordObj[_showForm+'Ac'][col] = []
        console.log('autoComplete', err.message)
      }
      const mwcAc = document.querySelector('mwc-autocomplete.'+col)
      // console.log('autoComplete res', res, mwcAc, col)
      mwcAc.setList(res)
    }, 500)

    const testFn = (e) => {
      console.log('testFn')
      // console.log(tableCfg.value)
      // console.log(recordObj)
      // showForm.value = showForm.value ? '' : 'add'
    }
    const goBack = () => router.back()

    const remove = async () => {
      // return console.log('remove gridEl.selectedItems', gridEl.selectedItems)
      if (loading.value) return
      loading.value = true
      const items = gridEl.selectedItems
      let ids = []
      try {
        const { pk } = tableCfg.value
        if (pk) {
          ids = items.map(item => item[pk])
        } else {
          ids = items.map(item => item.key)
        }
        // const rv =
        await httpGet('/api/t4t/remove/' + tableName, { ids })
      } catch (e) {
        alert( `Error delete ${e.toString()}` )
      }
      loading.value = false
      // await refresh()
      gridEl.clearCache()
    }

    const doAddOrEdit = async () => {
      // console.log(recordObj['edit'])
      // const items = gridEl.selectedItems
      // console.log('add ajax call', items)

      // validate
      const rec = recordObj[showForm.value]
      for (let col in rec) {
        if (tableCfg.value.cols[col]) {
          const { rules, type } = tableCfg.value.cols[col]
          if (rules) {
            const invalid = validate(rules, type, col, rec)
            if (invalid) {
              showForm.value = ''
              return alert(`Invalid ${col} - ${invalid}`)
            }
          }
        }
      }

      if (loading.value) return
      loading.value = true
      try {
        if (showForm.value === 'add') {
          await httpPost(`/api/t4t/create/${tableName}`, recordObj['add'])
        } else {
          const { key, ...data } = recordObj['edit']
          await httpPatch(`/api/t4t/update/${tableName}`, data, { key })
        }
      } catch (e) {
        alert( `Error ${showForm.value} ${e.toString()}` )
      }
      loading.value = false
      showForm.value = '' // close the form
      // await refresh()
      gridEl.clearCache()
    }

    const deleteFilter = (index) => filters.splice(index, 1) // console.log('remove filter', index)
    const addFilter = (index) => filters.splice( index, 0, { col: filterCols[0], op: '=', val: '', andOr: 'and' } )

    const csvImport = async () => { }
    const csvExport = async () => { }

    // watch(() => props.selected, (selection, prevSelection) => { }) // watching value of a reactive object (watching a getter)
    // const selected = ref(props.selected) // directly watching a ref
    // watch(selected, (selection, prevSelection) => { })
    // watch([ref1, ref2, ...], ([refVal1, refVal2, ...],[prevRef1, prevRef2, ...]) => { }) // Watching Multiple Sources

    const selectAllChanged = (e) => {
      if (!gridEl) return
      console.log(gridEl)
      const xxx = gridEl.querySelectorAll('vaadin-grid-selection-column')
      // console.log('xxx', xxx)
      .forEach(function(node) {
        console.log('node', node)
      })
      if (e.detail.value) {
        console.log('select all', e)
        // gridEl.selectedItems = [ ...gridEl.items ]
      } else {
        console.log('unselect all')
        // gridEl.selectedItems = []
      }
      // if (gridEl) gridEl.selectedItems = []
      // e.detail.value
      // set all checkboxes
      // clear all checkboxes
      // console.log('selectAllChanged', e.detail.value, e.target.selectAll)
    }

    return {
      selectAllChanged,

      testFn,
      router,

      keycol,
      keyval,
      goBack, // back to parent table...

      autoComplete, // method for autocomplete
      openAdd, // method populate default values and open form for add

      // CRUD
      remove, // method CRUD remove
      refreshData, // method CRUD find
      doAddOrEdit, // method CRUD post
      csvImport, // method CRUD import
      csvExport, // method CRUD export
      isRequired, // is column required

      // filters
      deleteFilter, // method
      addFilter, // method
      showFilter, // ref
      filters, // reactive
      filterCols, // reactive
      filterOps, // reactive

      showForm, // ref to show form (either add or edit) or not (empty string)
      recordObj, // reactive form data

      page, // ref
      records, // ref
      rowsPerPage, // ref
      maxPage, // ref
      headerCols, // reactive

      tableCfg, // reactive table config
      loading // ref
    }
  }
}
</script>

<style lang="css" scoped>
nav {
  width: 100%;
  background-color: lightgrey;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  padding-left: 4px;
}

.nav-right {
  padding-right: 4px;
}

.nav-left, .nav-right {
  margin-top: 1px;
  margin-bottom: 1px;
  list-style: none;
  display: flex;
}
.nav-item {
  display: inline-block;
  padding: 0px 2px;
  text-decoration: none;
  color: white;
}

.nav-select-page {
  height: 20px;
}

.nav-select-page-size {
  height: 26px;
}

.filter-row .filter-col {
  margin: 4px;
}

.table {
  /* TBD height and width should be configurable...
    height: 800px;
  */
  /* width: 1800px; */
}

.page-flex h1, .page-flex p {
  text-align: center;
}

.page-flex {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
  justify-content: center;
  align-items: center;
}

.form-box-flex { 
  width: 480px;

  display: flex; 
  flex-direction: column; 
  flex: 0 0 auto; 
  
  border-radius: 0px;
  padding: 15px;
  background: #eeeeee;
}

.field-set-flex { 
  height: calc(100vh - 300px);
  display: flex; 
  flex-direction: column; 
  flex: 0 0 auto;
  overflow: auto;
}

.field-item {
  padding-top: 8px;
  padding-bottom: 8px;
}

.drop-down-div {
  height: 150px;
}
.drop-down {
  height:150px;overflow-y:scroll;
}
</style>
