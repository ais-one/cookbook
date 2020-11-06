const template = /*html*/`
<div>
  <h1>Dashboard</h1>
  <!-- h1 v-for="n of 20">Test</h1 -->
  <bwc-table
    :page="page"
    :pageSize="pageSize"
    :pageSizeList="pageSizeList"
    :columns="columns"
    :items="items"
    :total="total"
    @rowClick="rowClick"
    @triggered="triggered"
    @cmd="cmd"
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
    const items = reactive([
      { id: 1, name: 'Aa', age: 10 },
      { id: 2, name: 'bb', age: 20 },
      { id: 3, name: 'cc', age: 30 },
      { id: 4, name: 'dd', age: 40 },
      { id: 5, name: 'ee', age: 50 },
      { id: 6, name: 'ff', age: 60 },
      { id: 7, name: 'gg', age: 70 },
      { id: 8, name: 'hh', age: 80 },
      { id: 9, name: 'ii', age: 90 }
    ])
    const total = ref(80)

    const rowClick = (e) => {
      console.log('rowClick', e.detail)
    }
    const triggered = (e) => {
      console.log('triggered', e.detail)
    }
    const cmd = (e) => {
      console.log('cmd', e.detail)
    }

    onMounted(async () => {
      console.log('Dashboard mounted!')
    })
    return {
      page,
      pageSize,
      pageSizeList,
      columns,
      items,
      total,
      rowClick,
      triggered,
      cmd
    }
  }
}
