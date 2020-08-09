<template>
  <div>

  <div class="container">
    <nav class="navbar">
      <ul class="nav-left">
        <li class="nav-item"><mwc-icon-button icon="search" @click="showFilter=!showFilter"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="refresh" @click="refresh"></mwc-icon-button></li>
        <li class="nav-item" v-if="tableCfg && tableCfg.create"><mwc-icon-button icon="add" @click="openAdd"></mwc-icon-button></li>
        <li class="nav-item" v-if="tableCfg && tableCfg.delete"><mwc-icon-button icon="delete" @click="remove"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="post_add" @click="csvImport"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="move_to_inbox"  @click="csvExport"></mwc-icon-button></li>
        <!-- <li class="nav-item"><mwc-icon-button icon="move_to_inbox"  @click="testBtn"></mwc-icon-button></li> -->
      </ul>
      <ul class="nav-right">
        <li class="nav-item">
          <vaadin-select class="select-page-size" :value="String(rowsPerPage)" :renderer="selectRenderer" style="width: 80px;"></vaadin-select>
        </li>
        <li class="nav-item">
          <vaadin-integer-field v-model="page" min="1" :max="maxPage" has-controls></vaadin-integer-field> / {{ maxPage }}
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

  <div class="container" v-if="showForm && tableCfg">
    <p>{{ showForm !== 'add' ? 'Edit' : 'Add' }}</p>
    <form>
      <template v-for="(val, col, index) of recordObj[showForm]">
        <template v-if="tableCfg.cols[col]">
          <!-- required? readonly? (edit) -->
          <mwc-textfield :key="index" :label="tableCfg.cols[col].label" outlined type="text" v-model="recordObj[showForm][col]"> </mwc-textfield>
        </template>
      </template>
      <button type="button" @click="showForm=''">Cancel</button>
      <button type="button" @click="doAddOrEdit">Confirm</button>
    </form>
  </div>

  </div>
</template>

<script>
import { onMounted, ref, reactive, onUnmounted } from 'vue'
import { httpGet, httpPost, httpPatch } from '../http'

export default {
  name: 'DemoTable',
  props: {
    rowsPerPage: {
      type: [Number],
      default: 10
    },
    rowsPerPageList: {
      type: Array,
      default: [5, 10, 25, 50]
    }
  },
  setup(props, ctx) { // ctx = attrs, slots, emit
    const tableCfg = ref(null) // table config
    const page = ref(1)
    const maxPage = ref(1)
    const rowsPerPage = ref(props.rowsPerPage)
    const rowsPerPageList = ref([])
    const headerCols = reactive([])
    const filters = reactive([])
    const filterCols = reactive([])
    const filterOps = ref(['=', 'like', '!=', '>=', '>', '<=', '<'])
    const showFilter = ref(false)
    const showForm = ref('') // '', add, edit
    const loading = ref(false)

    const recordObj = reactive({
      add: {},
      edit: {}
    })

    const tableName = props.tableName || 'country'
    let gridEl // grid element

    const rowClick = async (e) => {
      // console.log('click not on checkbox 1', e.detail.value)

      const item = e.detail.value
      e.stopPropagation()

      // TBD return if something is processing
      if (!item && tableCfg.value.multiSelect) return console.log('click item null')

      if (tableCfg.value.multiSelect) {
        gridEl.activeItem = null
      } else {
        console.log('single')
        gridEl.selectedItems = item ? [item] : []
      }

      console.log('aaaaaaa', item)
      if (!item) return // do not continue if item is null
      console.log('xxxxxxx', item)
      try {
        const rv = await httpGet('/api/t4t/find-one/' + tableName + '/' + item.key)

        recordObj['edit'].key = item.key
        Object.entries(tableCfg.value.cols).forEach(item => {
          const [key, val] = item
          if (val.edit !== 'hide' && !val.auto) recordObj['edit'][key] = rv[key]
        })
        console.log('recordObj', recordObj['edit'])
        showForm.value = 'edit'

      } catch (e) {
        console.log(e.toString())
      }
    }
    const selectClick = async (e) => { console.log('click on checkbox') }

    onMounted(async () => {
      // TBD handle if !tableName

      document.querySelector('vaadin-select.select-page-size').addEventListener('change', function(event) {
        // const item = event.detail.value // gridEl.selectedItems - same
        // console.log('change', event.target.value)
        rowsPerPage.value = event.target.value
      })

      gridEl = document.querySelector('vaadin-grid.table')

      if (!tableCfg.value) tableCfg.value = await httpGet('/api/t4t/config/' + tableName)
      if (tableCfg.value) {
        for (let col in tableCfg.value.cols) {
          const obj = tableCfg.value.cols[col]
          if (obj.table !== 'hide') headerCols.push({ path: col, header: obj.label }) // process table columns
          if (obj.filter !== 'hide') filterCols.push(col) // process filters
        }
        // Object.entries(tableCfg.value.cols) => [ [key, obj], ... ]        
      }

      gridEl.addEventListener('active-item-changed', rowClick)
      gridEl.addEventListener('selected-items-changed', selectClick)
      await refresh()
    })

    onUnmounted(()=> {
      gridEl.removeEventListener('active-item-changed', rowClick)
      gridEl.removeEventListener('selected-items-changed', selectClick)
    })

    const selectRenderer = (root) => {
      // I'm not familiar enough with Vue to use proper templating here. Use of innerHTML is naturally discouraged when rendering any non-static content
      if (!root.firstElementChild) {
        root.innerHTML = `
          <vaadin-list-box>
            <vaadin-item>5</vaadin-item>
            <vaadin-item>10</vaadin-item>
            <vaadin-item>25</vaadin-item>
            <vaadin-item>50</vaadin-item>
          </vaadin-list-box>
        `;
      }
    }

    const refresh = async () => {
      // console.log(filters)
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
    }

    const remove = async () => {
      const items = gridEl.selectedItems
      console.log('remove', items)
      let ids = []
      try {
        const { pk } = tableCfg.value
        if (pk) {
          ids = items.map(item => item[pk])
        } else {
          ids = items.map(item => item.key)
        }
        const rv = await httpGet('/api/t4t/remove/' + tableName, { ids })

        // TBD - run reload?
      } catch (e) {
        console.log(e.toString())
      }
    }

    const openAdd = async () => {
      // TBD return if async happening
      console.log('tableCfg.value', tableCfg.value)

      Object.entries(tableCfg.value.cols).forEach(item => {
        const [key, val] = item
        if (val.add !== 'hide' && !val.auto) recordObj['add'][key] = val.default || (val.type === 'integer' || val.type === 'decimal' ? 0 : '')
      })
      showForm.value = 'add'
    }

    const testBtn = () => {
      console.log(tableCfg.value)
      showForm.value = showForm.value ? '' : 'add'
    }

    const doAddOrEdit = async () => {
      // console.log(recordObj['edit'])
      // const items = gridEl.selectedItems
      // console.log('add ajax call', items)
      // TBD - run reload?, set loading
      try {
        if (showForm.value === 'add') {
          await httpPost(`/api/t4t/create/${tableName}`, recordObj['add'])
        } else {
          const { key, ...data } = recordObj['edit']
          await httpPatch(`/api/t4t/update/${tableName}/${key}`, data)
        }
      } catch (e) {
        console.log('patch', e.toString())
      }
    }

    const update = async () => {
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
      testBtn,
      remove, // methods
      openAdd,
      refresh,
      deleteFilter,
      addFilter,
      showFilter,
      filters,
      showForm,
      recordObj,
      filterCols,
      filterOps,
      tableCfg, // table config
      page,
      rowsPerPage,
      maxPage,
      headerCols,
      selectRenderer,
      doAddOrEdit,
      csvImport,
      csvExport
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

.filter-row .filter-col {
  margin: 4px;
}
</style>
