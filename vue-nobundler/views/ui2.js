const template = /*html*/`
<div>
  <h1>UI Table</h1>
  <bwc-table
    commands="reload,filter,add,del"
    :pagination="true"
    :sort="true"
    :page="page"
    :pageSize="pageSize"
    :pageSizeList="pageSizeList"
    :columns="columns"
    :items="table.items"
    :total="total"
    @rowclick="rowClick"
    @checked="checked"
    @triggered="triggered"
    @cmd="cmd"
    @testevent.capture="testevent"
    style="--bwc-table-height: calc(100vh - 360px);--bwc-table-width: 200%;--bwc-table-navbar-bgcolor: lightgray;--bwc-table-filter-bgcolor: cyan;--bwc-table-th-bgcolor: pink;--bwc-table-td-bgcolor: white;"
    class="sticky-header sticky-column"
  ></bwc-table>
  <hr/>
  <bwc-table
    commands="reload"
    :pagination="false"
    :sort="false"
    :columns="columns"
    :items="table.items"
    :total="total"
    style="--bwc-table-height: calc(100vh - 360px);--bwc-table-width: 200%;"
    class="sticky-header sticky-column"
  ></bwc-table>
</div>
`

import * as t4t from '/esm/t4t-fe.js'
const { onMounted, ref, reactive } = Vue

export default {
  template,
  setup() {
    const page = ref(1)
    const pageSize = ref(10)
    const pageSizeList = [5, 10, 15]
    const columns = reactive([
      {
        label: 'ID',
        key: 'id',
        filter: false,
        render: ({val, key, row, idx}) => {
          const cell = val + ' is ' + (row['age'] > 5 ? '>5' : '<=5')
          const output =
            // do not include row as there can be too much data
            // `<a class='button' onclick='this.dispatchEvent(new CustomEvent("testevent", { detail: ${JSON.stringify({ val, key, row, idx })} }))'>${val}</a>` // too much data if row included
            `<a class="button" onclick="this.dispatchEvent(new CustomEvent('testevent', { detail: { key: '${key}', val: '${val}', idx: ${idx} } }))">${cell}</a>`
          return output
        }
      },
      {
        label: 'Name',
        key: 'name',
        filter: true,
        sort: true
      },     
      {
        label: 'Age',
        key: 'age',
        filter: true,
        sort: true
      }
    ])
    for (let i=1; i<=15; i++) {
      columns.push({
        label: 'label' + i,
        key: 'key' + i,
        width: 120
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      })
    }

    const itemList = []
    for (let i=1; i<=30; i++) {
      const data = {
        id: i,
        name: 'name' + i,
        age: i
      }
      for (let j=1; j<=15; j++) {
        data['key' + j] = `r${i}-c${j}`
      }
      itemList.push(data)
    }

    const table = reactive({
      items: []
    })
    const total = ref(30)

    const setItems = () => {
      const items = []
      const offset = (page.value - 1) * pageSize.value
      for (let i = 0; i<pageSize.value; i++) {
        if (!itemList[offset + i]) break
        items.push( itemList[offset + i] )
      }
      // console.log(items)
      table.items = items
    }

    const rowClick = (e) => {
      console.log('rowClick', e.detail)
    }
    const checked = (e) => {
      console.log('checked', e.detail)
    }
    const triggered = (e) => {
      console.log('triggered', e.detail)
      page.value = e.detail.page
      pageSize.value = e.detail.pageSize
      console.log(page.value, pageSize.value)
      setItems()
    }
    const cmd = (e) => {
      console.log('cmd', e.detail)
    }
    const testevent = (e) => {
      console.log('testevent', e.detail, e.target)
      const { key, val, idx } = e.detail
      console.log('ev2', table.items[idx]['age'])
      table.items[idx]['age'] += 1
      setItems()
    }
    
    onMounted(async () => {
      // addEventListener('testevent', (e) => console.log('testevent', e), true)
      console.log('ui2 mounted!')
      t4t.setTableName('person')
      // form.config = await t4t.getConfig()
      // form.record = await t4t.findOne('5f3a35197dc9e61b64e0dea9')
      // Object.assign(test, form.config)
      // console.log(test)
      // for (var key in test) delete test[key]
      // Object.assign(test, {})
      // console.log(test.length)
      // console.log(form)
      setItems()
    })
    return {
      page,
      pageSize,
      pageSizeList,
      columns,
      table,
      total,
      rowClick,
      checked,
      triggered,
      cmd,
      testevent
    }
  }
}
