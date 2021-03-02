const template = /*html*/`
<div>
  <input type="file" id="upload" style="display:none" @change="doUpload">
  <bwc-t4t-form
    v-if="mode"
    :config="table.config"
    :record="form.record"
    :mode="mode"
    @submit="submitForm"
    @cancel="cancelForm"
    style="--bwc-t4t-form-height: calc(100vh - 200px);"
  ></bwc-t4t-form>
  <bwc-table
    v-else
    commands="reload,filter,add,del,import,export"
    :pagination="true"
    :sort="true"
    :page="page"
    :pageSize="pageSize"
    :pageSizeList="pageSizeList"
    :columns="table.columns"
    :items="table.items"
    :total="table.total"
    @rowclick="rowClick"
    @checked="checked"
    @triggered="triggered"
    @cmd="cmd"
    style="--bwc-table-height: calc(100vh - 160px);--bwc-table-width: 100%;"
    class="sticky-header sticky-column"
  ></bwc-table>
</div>
`

import * as t4t from '/esm/t4t-fe.js'
import { downloadData } from '/esm/util.js'

const { onMounted, ref, reactive } = Vue

const tableName = 'person' // country, person

export default {
  template,
  setup() {
    // reactive
    const mode = ref('')
    const page = ref(1)
    const pageSize = ref(10)
    const table = reactive({
      config: {},
      columns: [], // label, key, filter, sort, render, width
      items: [],
      total: 0
    })
    const form = reactive({
      record: {}
    })
    // non reactive
    const pageSizeList = [5, 10, 15]
    let filters = []
    let sorter = []

    const rowClick = async (e) => {
      console.log('rowClick', e.detail) // row, cod, data
      form.record = await t4t.findOne(e.detail.data._id) // either use e.detail.data, or fetch from API
      mode.value = 'edit'
      // Object.assign(test, form.config)
    }

    const submitForm = async (e) => {
      console.log('submitForm', e.detail)
      // do update here and display error message?
      const { data, error } = e.detail
      if (error) return alert('Validation Error')
      const invalid = t4t.validate(data)
      if (invalid) return alert(`Invalid ${invalid.col} - ${invalid.msg}`)

      // if (loading.value) return
      // loading.value = true
      const signedUrl = false
      try {
        if (mode.value === 'add') {
          const rv = t4t.processData(data, { signedUrl })
          await t4t.create(data, rv.form ? rv.form : rv.json)
          if (rv.files) { // upload using signed URL
            for (const file of rv.files) {
              await t4t.uploadGoogle(file) // tbd use... promise.allSettled
              // await t4t.deleteGoogle(file.name) // tbd use... promise.allSettled
            }
          }
          page.value = 1 // for reload
        } else {
          const { __key, ...noKeyData } = data
          const rv = t4t.processData(noKeyData, { signedUrl })
          await t4t.update(__key, rv.form ? rv.form : rv.json)
          if (rv.files) { // upload using signed URL
            for (const file of rv.files) {
              await t4t.uploadGoogle(file) // tbd use... promise.allSettled
              // await t4t.deleteGoogle(file.name) // tbd use... promise.allSettled
            }
          }
        }
      } catch (e) {
        alert(`Error ${mode.value} ${e.toString()}`)
      }
      // loading.value = false
      mode.value = ''
      await refreshTable()
    }

    const cancelForm = async (e) => mode.value = ''

    const refreshTable = async () => {
      const rv = await t4t.find(filters, sorter, page.value, pageSize.value)
      table.total = rv.total
      table.items = rv.results
    }

    const doUpload = async (e) => {
      console.log('doUpload', e.target.files)
      try {
        const { files } = e.target
        if (files && files.length) {
          const rv = await t4t.upload(files[0])
          console.log(rv)
          if (rv.data.errorCount) alert('Error: ' + JSON.stringify(rv.data.errors))
          else alert('Upload OK')
          await refreshTable()
        }
        /* one file...
        lastModified: 1610553661046
        lastModifiedDate: Thu Jan 14 2021 00:01:01 GMT+0800 (Singapore Standard Time) {}
        name: "notes.txt"
        size: 4326
        type: "text/plain"
        webkitRelativePath: ""
        */
      } catch (e) {
        console.log('doUpload', e.toString())
      }
    }

    // events
    const checked = (e) => {
      console.log('checked', e.detail)
    }
    const triggered = async (e) => {
      // TBD if (name === 'page-size') ...
      console.log('triggered', e.detail)
      page.value = e.detail.page
      pageSize.value = e.detail.pageSize
      filters = e.detail.filters
      const { sortDir, sortKey } = e.detail // name
      sorter = sortKey ? [{ column: sortKey, order: sortDir}] : []
      await refreshTable()
    }
    const cmd = async (e) => {
      console.log('cmd', e.detail)
      try {
        if (e.detail.cmd === 'add') {
          form.record = t4t.initItem()
          mode.value = 'add'
        } else if (e.detail.cmd === 'del') {
          const items = e.detail.checkedRows.map(idx => table.items[idx])
          await t4t.remove(items)
          page.value = 1
          await refreshTable()
        } else if (e.detail.cmd === 'import') {
          document.querySelector('#upload').click()
        } else if (e.detail.cmd === 'export') {
          // TBD const _filters = keycol.value ? [...filters, { col: keycol.value, op: '=', val: keyval.value, andOr: 'and' }] : filters
          const data = await t4t.download(filters, sorter)
          if (data) downloadData(data.csv, tableName + '.csv', 'text/csv;charset=utf-8;')
        }
      } catch (e) {        
        console.log('error cmd', e.toString())
      }
    }

    // lifecycle
    onMounted(async () => {
      console.log('ui4 mounted!')
      t4t.setTableName(tableName) // country
      table.config = await t4t.getConfig()

      // create the columns
      table.columns = Object.entries(table.config.cols)
        .filter(([k,v]) => !v.hide)
        .map(([k,v]) => {
          return {
            key: k,
            label: v.label,
            filter: v.filter || false,
            sort: v.sort || false
            // width
            // How to handle render function?
          }
        })

      // get initial data...
      await refreshTable()
    })
    return {
      // reactive / ref
      mode,
      table,
      form,
      page,
      pageSize,
      pageSizeList,
      // methods
      rowClick,
      submitForm,
      cancelForm,
      doUpload,
      // events
      checked,
      triggered,
      cmd,
    }
  }
}
