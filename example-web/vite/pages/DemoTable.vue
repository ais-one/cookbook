<template>
  <div>
    <vcxwc-loading-overlay v-if="loading"></vcxwc-loading-overlay>
    <div class="container" v-show="!showForm">
      <nav class="navbar">
        <ul class="nav-left">
          <li class="nav-item"><mwc-icon-button icon="search" @click="showFilter=!showFilter"></mwc-icon-button></li>
          <li class="nav-item"><mwc-icon-button icon="refresh" @click="refresh" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item" v-if="tableCfg && tableCfg.create"><mwc-icon-button icon="add" @click="openAdd" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item" v-if="tableCfg && tableCfg.delete"><mwc-icon-button icon="delete" @click="remove" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item"><mwc-icon-button icon="post_add" @click="csvImport" :disabled="loading"></mwc-icon-button></li>
          <li class="nav-item"><mwc-icon-button icon="move_to_inbox"  @click="csvExport" :disabled="loading"></mwc-icon-button></li>
          <!-- <li class="nav-item"><mwc-icon-button icon="move_to_inbox"  @click="testFn"></mwc-icon-button></li> -->
        </ul>
        <ul class="nav-right">
          <li class="nav-item">
            <select class="select-page-size" v-model="rowsPerPage">
              <option v-for="val of rowsPerPageList" :key="val" :value="val" :selected="val === rowsPerPage" >{{ val }}</option>
            </select>
          </li>
          <li class="nav-item">
            <input class="select-page" type="number" v-model="page" min="1" :max="maxPage" /> / {{ maxPage }}
          </li>
        </ul>
      </nav>

      <!-- filter row -->
      <template v-if="showFilter">
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
      </template>

      <vaadin-grid class="table"><!-- page-size="10" height-by-rows -->
        <vaadin-grid-selection-column v-if="tableCfg && tableCfg.multiSelect"></vaadin-grid-selection-column><!-- remove auto-select click only on checkbox-->
        <vaadin-grid-column
          v-for="(headerCol, index) in headerCols" :key="index"
          :path="headerCol.path"
          :header="headerCol.header">
        </vaadin-grid-column>
        <!--  for last column text-align="end" width="120px" flex-grow="0" -->
      </vaadin-grid>
    </div>

    <div class="page-flex" v-if="showForm && tableCfg">
      <form class="form-box-flex">
        <p>{{ showForm !== 'add' ? 'Edit' : 'Add' }}</p>
        <div class="field-set-flex">
          <template v-for="(val, col, index) of recordObj[showForm]">
            <template v-if="tableCfg.cols[col]">
              <!-- required? readonly? (edit) -->
              <template v-if="tableCfg.cols[col].input==='number'">
                <mwc-textfield class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="number" v-model="recordObj[showForm][col]"></mwc-textfield>
              </template>           
              <template v-else-if="tableCfg.cols[col].input==='datetime'">
                <mwc-textfield class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="datetime-local" v-model="recordObj[showForm][col]"></mwc-textfield>
              </template>           
              <template v-else-if="tableCfg.cols[col].input==='date'">
                <mwc-textfield class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="date" v-model="recordObj[showForm][col]"></mwc-textfield>
              </template>           
              <template v-else-if="tableCfg.cols[col].input==='time'">
                <mwc-textfield class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="time" v-model="recordObj[showForm][col]"></mwc-textfield>
              </template>
              <template v-else-if="tableCfg.cols[col].input==='select'">
                <mwc-select :key="col+index" :label="tableCfg.cols[col].label" :value="recordObj[showForm][col]" @change="(e) => recordObj[showForm][col] = e.target.value">
                  <mwc-list-item v-for="(option, index2) of tableCfg.cols[col].options" :value="option.key" :key="col+index+'-'+index2">{{ option.text }}</mwc-list-item>
                </mwc-select>
              </template>
              <template v-else-if="tableCfg.cols[col].input==='multi-select'">
                <!-- tableCfg.cols[col].label -->

                <mwc-textfield
                  class="field-item"
                  :key="col+index"
                  :label="tableCfg.cols[col].label"
                  outlined
                  type="text"
                  disabled
                  :value="recordObj[showForm][col]"
                  :iconTrailing="recordObj[showForm + 'DdShow'][col] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="recordObj[showForm + 'DdShow'][col]=!recordObj[showForm + 'DdShow'][col]"
                ></mwc-textfield>
                <template v-if="recordObj[showForm + 'DdShow'][col]">
                  <mwc-list :key="'l'+col+index" multi @selected="(e) => multiSelect(e, col, showForm)">
                    <mwc-check-list-item v-for="(option, index2) of tableCfg.cols[col].options" :selected="recordObj[showForm][col].includes(option.key)" :key="col+index+'-'+index2">{{ option.text }}</mwc-check-list-item>
                  </mwc-list>
                </template>
              </template>
              <!-- <template v-else-if="tableCfg.cols[col].input==='autocomplete'">
              </template>            -->
              <template v-else>
                <mwc-textfield class="field-item" :key="col+index" :label="tableCfg.cols[col].label" outlined type="text" v-model="recordObj[showForm][col]"></mwc-textfield>
              </template>           
            </template>
          </template>
        </div>
        <mwc-button type="button" @click="showForm=''">Cancel</mwc-button>
        <mwc-button type="button" @click="doAddOrEdit" :disabled="loading">Confirm</mwc-button>
        <!-- <mwc-button type="button" @click="testFn">Test</mwc-button> -->
      </form>
    </div>

  </div>
</template>

<script>
// TBD debounce for async inputs
// TBD slots for forms and 
// TBD inline edits

import { APP_VERSION } from 'http://127.0.0.1:3000/js/util.js'
import { onMounted, ref, reactive, onUnmounted } from 'vue'
import { httpGet, httpPost, httpPatch } from '../http'

export default {
  name: 'DemoTable',
  props: {
    rowsPerPage: { type: [Number], default: 10 },
    rowsPerPageList: { type: Array, default: [5, 10, 25, 50] },
    tableName: { type: String, required: true }
  },
  setup(props, ctx) { // ctx = attrs, slots, emit
    const tableCfg = ref(null) // table config
    const page = ref(1)
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
      addDdShow: {},
      editDdShow: {}
    })

    const tableName = props.tableName || 'person'

    let gridEl // grid element

    const _rowClick = async (e) => {
      // TBD handle single select / multi select
      // console.log('click not on checkbox 1', e.detail.value)
      const item = e.detail.value
      e.stopPropagation()
      if (loading.value) return // return if something is processing

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
        Object.entries(tableCfg.value.cols).forEach(item => {
          const [key, val] = item
          if (val.edit !== 'hide' && !val.auto) {
            recordObj['edit'][key] = rv[key]

            if (val.input === 'multi-select') recordObj['editDdShow'][key] = false
          }
        })
        showForm.value = 'edit'
      } catch (e) {
        console.log(e.toString())
      }
    }

    const selectClick = async (e) => { console.log('click on checkbox') }

    onMounted(async () => {
      // console.log('APP_VERSION', APP_VERSION)
      // TBD handle if !tableName
      // TBD handle if cannot get config
      // TBD handle if cannot load data
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
        gridEl.addEventListener('selected-items-changed', selectClick)
      }
      await refresh()
    })
    onUnmounted(()=> {
      if (gridEl) {
        gridEl.removeEventListener('active-item-changed', _rowClick)
        gridEl.removeEventListener('selected-items-changed', selectClick)
      }
    })

    const openAdd = async () => {
      Object.entries(tableCfg.value.cols).forEach(item => {
        const [key, val] = item
        if (val.add !== 'hide' && !val.auto) {
          recordObj['add'][key] = val.default || (val.type === 'integer' || val.type === 'decimal' ? 0 : '')

          if (val.input === 'multi-select') recordObj['addDdShow'][key] = false
        }
      })
      showForm.value = 'add'
    }

    const multiSelect = (e, col, showForm) => {
      const items = []
      console.log(e.detail.index.values())
      e.detail.index.forEach((a, b, c) => {
        const opt = tableCfg.value.cols[col].options[a]
        if (opt && opt.key) {
          const item = opt.key
          items.push(item)
        }
      })
      recordObj[showForm][col] = items.join(',')
    }

    const testFn = (e) => {
      // console.log(tableCfg.value)
      // console.log(recordObj)
      // showForm.value = showForm.value ? '' : 'add'
      console.log(e)
    }

    const refresh = async () => {
      if (loading.value) return
      loading.value = true
      try {
        gridEl.selectedItems = []

        const rv = await httpGet('/api/t4t/find/' + tableName, {
          page: page.value,
          limit: rowsPerPage.value,
          filters: JSON.stringify(filters)
        })

        if (rv.results) {
          console.log('rv.total', rv.total)
          gridEl.items = rv.results
          maxPage.value = Math.ceil(rv.total / rowsPerPage.value)
        }
      } catch (e) {
        console.log(e.toString())
      }
      loading.value = false
    }

    const remove = async () => {
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
        const rv = await httpGet('/api/t4t/remove/' + tableName, { ids })
      } catch (e) {
        alert( `Error delete ${e.toString()}` )
      }
      loading.value = false
      await refresh()
    }

    const doAddOrEdit = async () => {
      // console.log(recordObj['edit'])
      // const items = gridEl.selectedItems
      // console.log('add ajax call', items)
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
      await refresh()
    }

    const deleteFilter = (index) => {
      filters.splice(index, 1);
      // console.log('remove filter', index)
    }

    const addFilter = (index) => {
      filters.splice( index, 0, {
        col: filterCols[0],
        op: '=',
        val: '',
        andOr: 'and'
      } )
    }

    const csvImport = async () => { }
    const csvExport = async () => { }

    // // watching value of a reactive object (watching a getter)
    // watch(() => props.selected, (selection, prevSelection) => { })
    // // directly watching a ref
    // const selected = ref(props.selected)
    // watch(selected, (selection, prevSelection) => { })
    // // Watching Multiple Sources
    // watch([ref1, ref2, ...], ([refVal1, refVal2, ...],[prevRef1, prevRef2, ...]) => { })

    return {
      testFn,
      multiSelect, // method for multi select event...
      openAdd, // method populate default values and open form for add

      // CRUD
      remove, // method CRUD remove
      refresh, // method CRUD find
      doAddOrEdit, // method CRUD post
      csvImport, // method CRUD import
      csvExport, // method CRUD export

      // filters
      deleteFilter, // method
      addFilter, // method
      showFilter, // ref
      filters, // reactive
      filterCols, // reactive
      filterOps, // reactive

      showForm, // ref to show form (either add or edit) or not
      recordObj, // reactive form data

      page, // ref
      rowsPerPage, // ref
      maxPage, // ref
      headerCols, // reactive

      tableCfg, // reactive table config
      loading // ref
    }
  }
}
</script>

<style>
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

.nav-item mwc-textfield {
  width: 80px;
}

.select-page-size {
  height: 26px;
}

.filter-row .filter-col {
  margin: 4px;
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

</style>
