const template = /*html*/`
<div>
  <h1>Dashboard</h1>
  <!-- h1 v-for="n of 20">Test</h1 -->
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
    @rowClick="rowClick"
    @checked="checked"
    @triggered="triggered"
    @cmd="cmd"
    style="--bwc-table-height: calc(100vh - 360px);--bwc-table-width: 200%;--bwc-navbar-bgcolor: lightgray;--bwc-filter-bgcolor: cyan;--bwc-th-bgcolor: pink;--bwc-td-bgcolor: white;"
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
    style="--bwc-table-height: calc(100vh - 360px);--bwc-table-width: 200%;--bwc-navbar-bgcolor: lightgray;--bwc-filter-bgcolor: cyan;--bwc-th-bgcolor: pink;--bwc-td-bgcolor: white;"
    class="sticky-header sticky-column"
  ></bwc-table>
</div>
`

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
        render: (val, key, row) => `<a class='button' onclick='dispatchEvent(new CustomEvent("testevent", { detail: ${JSON.stringify({ val, key, row })} }))'>${val}</a>`
        // render: (val, key, row) => `<a class="button" onclick="dispatchEvent(new CustomEvent('testevent', { detail: { key: '${key}', val: '${val}' } }))">${val}</a>`
        // can also fire off event - document.dispatchEvent(new CustomEvent('something', { detail: { val, row, key } }))
      },
      {
        label: 'Name',
        key: 'name',
        filter: true
      },     
      {
        label: 'Age',
        key: 'age',
        filter: true
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
        data['key' + j] = 'val-'+i+'-'+j
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

    onMounted(async () => {
      console.log('Dashboard mounted!')
      addEventListener('testevent', (e) => console.log('testevent', e), true)
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
      cmd
    }
  }
}
