const template = /*html*/`
<div>
  <bwc-t4t-form
    v-if="mode"
    :config="table.config"
    :record="form.record"
    :mode="mode"
    @submit="submitForm"
    @cancel="cancelForm"
    style="--bwc-t4t-form-height: calc(100vh - 300px);"
  ></bwc-t4t-form>
  <bwc-table
    v-else
    commands="reload,filter,add,del"
    :pagination="true"
    :sort="true"
    :page="page"
    :pageSize="pageSize"
    :pageSizeList="pageSizeList"
    :columns="table.columns"
    :items="table.items"
    :total="table.total"
    @rowClick="rowClick"
    @checked="checked"
    @triggered="triggered"
    @cmd="cmd"
    style="--bwc-table-height: calc(100vh - 160px);--bwc-table-width: 100%;"
    class="sticky-header sticky-column"
  ></bwc-table>
</div>
`

import * as t4t from '/esm/t4t-fe.js'
const { onMounted, ref, reactive } = Vue

export default {
  template,
  setup() {
    const mode = ref('')
    const page = ref(1)
    const pageSize = ref(10)
    const pageSizeList = [5, 10, 15]

    const table = reactive({
      config: {},
      columns: [], // label, key, filter, sort, render, width
      items: [],
      total: 0
    })

    const form = reactive({
      record: {}
    })

    const rowClick = async (e) => {
      console.log('rowClick', e.detail) // row, cod, data
      form.record = await t4t.findOne(e.detail.data._id) // either use e.detail.data, or fetch from API
      mode.value = 'edit'
      // Object.assign(test, form.config)
    }

    const submitForm = async (e) => {
      console.log('submitForm', e.detail)
      // do update here and display error message?
      if (e.detail.error) return alert('Validation Error')

      // if (mode.value === 'edit') {
      // } else {
      // }
      mode.value = ''
    }

    const cancelForm = async (e) => mode.value = ''

    const checked = (e) => {
      console.log('checked', e.detail)
    }
    const triggered = async (e) => {
      // TBD if (name === 'page-size') ...
      console.log('triggered', e.detail)
      const { filters, sortDir, sortKey } = e.detail // name
      page.value = e.detail.page
      pageSize.value = e.detail.pageSize
      const sorter = sortKey ? [{ column: sortKey, order: sortDir}] : []
      const rv = await t4t.find(filters, sorter, page.value, pageSize.value)
      table.total = rv.total
      table.items = rv.results
    }
    const cmd = (e) => {
      console.log('cmd', e.detail)
      if (e.detail.cmd === 'add') {
        form.record = t4t.newItem()
        mode.value = 'add'
      } else if (e.detail.cmd === 'del') {
        // e.detail.items
      }
    }
    
    onMounted(async () => {
      console.log('ui4 mounted!')
      t4t.setTableName('person') // country
      table.config = await t4t.getConfig()

      // get initial data...
      const rv = await t4t.find([], [], page.value, pageSize.value)

      // create the columns
      table.columns = Object.entries(table.config.cols)
        .filter(entry => !entry[1].hide)
        .map(entry => {
          return {
            key: entry[0],
            label: entry[1].label,
            filter: entry[1].filter || false,
            sort: entry[1].sort || false
            // width
            // How to handle render function?
          }
        })
      table.total = rv.total
      table.items = rv.results
    })
    return {
      mode,
      table,
      form,
      page,
      pageSize,
      pageSizeList,
      rowClick,
      checked,
      triggered,
      cmd,
      submitForm,
      cancelForm
    }
  }
}
