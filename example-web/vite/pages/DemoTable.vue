<template>
  <div class="container">
    <nav class="navbar">
      <ul class="nav-left">
        <li class="nav-item"><mwc-icon-button icon="search" @click="showFilter=!showFilter"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="refresh" @click="refresh"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="add"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="delete"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="post_add"></mwc-icon-button></li>
        <li class="nav-item"><mwc-icon-button icon="move_to_inbox"></mwc-icon-button></li>
      </ul>
      <ul class="nav-right">
        <li class="nav-item">
          <vaadin-select :value="'5'" :renderer="selectRenderer" style="width: 80px;"></vaadin-select>
        </li>
        <li class="nav-item">
          <vaadin-integer-field v-model="page" min="1" :max="maxPage" has-controls></vaadin-integer-field> / {{ maxPage }}
        </li>
      </ul>
    </nav>
    <!-- {{ rowsPerPage }}
    <a href="#">&lt;</a>
    <input type="number" v-model="page" min="1" :max="maxPage" /> / {{ maxPage }}
    <a href="#">&gt;</a> -->
    <!-- <div class="pagination">
      <a href="#">&laquo;</a>
      <a href="#">&raquo;</a>
    </div> -->
    <!-- <div class="filter">
      <vaadin-grid class="filter">
        <vaadin-grid-column path="col" header="Field"></vaadin-grid-column>
        <vaadin-grid-column path="op" header="Operator"></vaadin-grid-column>
        <vaadin-grid-column path="val" header="Value"></vaadin-grid-column>
        <vaadin-grid-column path="andOr" header="And Or"></vaadin-grid-column>
      </vaadin-grid>
    </div> -->

    <!-- filter row -->
    <template v-if="showFilter">
      <div class="filter-row" v-for="(filter, index) of filters" :key="index">
        <select class="filter-col" v-model="filter.col">
          <option v-for="(col, index1) of filterCols" :value="col" :key="'c'+index+'-'+index1">{{ col }}</option>
        </select>
        <select class="filter-col" v-model="filter.op">
          <option v-for="(col, index2) of filterOps" :value="col" :key="'o'+index+'-'+index2">{{ col }}</option>
        </select>
        <input class="filter-col" v-model="filter.val" />
        <select class="filter-col" v-model="filter.andOr">
          <option value="and">And</option>
          <option value="or">Or</option>
        </select>
        <button :disabled="filters.length<2" class="filter-col" @click="deleteFilter(index)">x</button>
        <button class="filter-col" @click="addFilter(index + 1)">+</button>
      </div>
    </template>

    <vaadin-grid class="table"><!-- page-size="10" height-by-rows -->
      <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
      <vaadin-grid-column
        v-for="(headerCol, index) in headerCols" :key="index"
        :path="headerCol.path"
        :header="headerCol.header">
      </vaadin-grid-column>
      <!--  for last column text-align="end" width="120px" flex-grow="0" -->
    </vaadin-grid>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue'
import { test, find } from '../http'

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
    const headerCols = ref([])
    const filters = reactive([])
    const filterCols = ref([])
    const filterOps = ref(['=', 'like', '!=', '>=', '>', '<=', '<'])
    const showFilter = ref(false)


    let gridEl

    onMounted(async () => {

      // const vv = document.querySelector('vaadin-select')
      document.querySelector('vaadin-select').addEventListener('change', function(event) {
        // const item = event.detail.value // gridEl.selectedItems - same
        console.log('change', event.target.value)
      })

      gridEl = document.querySelector('vaadin-grid.table')

      if (!tableCfg.value) tableCfg.value = await find('/api/t4t/config/country')
      if (tableCfg.value) {
        // TBD add filter to remove columns you do not want to show
        headerCols.value = Object.entries(tableCfg.value.cols).map(item => {
          const [key, val] = item
          // console.log(item, key, val)
          return {
            path: key,
            header: val.label
          }
        })
        // Object.keys(tableCfg.value.cols)
      }

      filterCols.value = Object.keys(tableCfg.value.cols)
      addFilter(0)

      // active-item-changed
      gridEl.addEventListener('selected-items-changed', function(event) {
        const item = event.detail.value // gridEl.selectedItems - same
        console.log('bb', item)
      })

      try {
        const rv = await find('/api/t4t/find/country', {
          page: page.value,
          limit: rowsPerPage.value
        })
        if (rv.results) {
          console.log('rv.total', rv.total)
          gridEl.items = rv.results
          maxPage.value = Math.ceil(rv.total / rowsPerPage.value)
        }
      } catch (e) {
        console.log(e.toString())
      }
    })

    const selectRenderer = (root) => {
      // I'm not familiar enough with Vue to use proper templating here. Use of innerHTML is naturally discouraged when rendering any non-static content
      if (!root.firstElementChild) {
        root.innerHTML = `
          <vaadin-list-box>
            <vaadin-item>5</vaadin-item>
            <vaadin-item>10</vaadin-item>
          </vaadin-list-box>
        `;
      }
    }

    const refresh = async () => {
      console.log(filters)
    }

    const deleteFilter = (index) => {
      filters.splice(index, 1);
      // console.log('remove filter', index)
    }
    const addFilter = (index) => {
      // if (!index) {
      //   filters.push({
      //     col: filterCols.value[0],
      //     op: '=',
      //     val: '',
      //     andOr: 'and'
      //   })
      // } else {
        filters.splice( index, 0, {
          col: filterCols.value[0],
          op: '=',
          val: '',
          andOr: 'and'
        } )
      // }
    }

    // // watching value of a reactive object (watching a getter)
    // watch(() => props.selected, (selection, prevSelection) => { })
    // // directly watching a ref
    // const selected = ref(props.selected)
    // watch(selected, (selection, prevSelection) => { })
    // // Watching Multiple Sources
    // watch([ref1, ref2, ...], ([refVal1, refVal2, ...],[prevRef1, prevRef2, ...]) => { })
    return {
      refresh, // methods
      deleteFilter,
      addFilter,
      showFilter,
      filters,
      filterCols,
      filterOps,
      tableCfg, // table config
      page,
      rowsPerPage,
      maxPage,
      headerCols,
      selectRenderer
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
