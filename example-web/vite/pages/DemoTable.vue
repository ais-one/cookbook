<template>
  <div class="container">
    {{ rowsPerPage }}
    <div class="pagination">
      <a href="#">&laquo;</a>
      <a href="#">&lt;</a>
      <div><input type="number" v-model="page" /> of</div>
      <a href="#">{{ maxPage }}</a>
      <a href="#">1000000000</a>
      <a href="#">&gt;</a>
      <a href="#">&raquo;</a>
    </div>
    <vaadin-grid><!-- page-size="10" height-by-rows -->
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
import { onMounted, ref } from 'vue'
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
  setup(props) {
    const page = ref(1)
    const maxPage = ref(1)
    const rowsPerPage = ref(props.rowsPerPage)
    const rowsPerPageList = ref([])
    const headerCols = ref([])

    let gridEl

    onMounted(async () => {

      gridEl = document.querySelector('vaadin-grid')
      // console.log('gridEl', gridEl)
      // test()
      const rv = await find('/api/t4t/config/country')
      if (rv.cols) {
        headerCols.value = Object.entries(rv.cols).map(item => {
          const [key, val] = item
          // console.log(item, key, val)
          return {
            path: key,
            header: val.label
          }
        })
      }

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

// // watching value of a reactive object (watching a getter)
// watch(() => props.selected, (selection, prevSelection) => { 
// })
// // directly watching a ref
// const selected = ref(props.selected)
// watch(selected, (selection, prevSelection) => { 
// })
// // Watching Multiple Sources
// watch([ref1, ref2, ...], ([refVal1, refVal2, ...],[prevRef1, prevRef2, ...]) => { 
// })
    return {
      page,
      rowsPerPage,
      maxPage,
      headerCols
    }
  }
}
</script>

<style>
.pagination {
  display: inline-block;
}

.pagination a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  transition: background-color .3s;
  border: 1px solid #ddd;
}

.pagination div {
  color: black;
  float: left;
  padding: 4px 8px;
  text-decoration: none;
  transition: background-color .3s;
  border: 1px solid #ddd;
}

.pagination a.active {
  background-color: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
}

.pagination a:hover:not(.active) {background-color: #ddd;}
</style>
