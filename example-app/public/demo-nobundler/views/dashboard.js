const template = /*html*/`
<div>
  <h1>Dashboard</h1>
  <!-- h1 v-for="n of 20">Test</h1 -->
  <bwc-table
    :commands="true"
    :pagination="true"
    :sort="true"
    :page="page"
    :pageSize="pageSize"
    :pageSizeList="pageSizeList"
    :columns="columns"
    :items="items"
    :total="total"
    @rowClick="rowClick"
    @triggered="triggered"
    @cmd="cmd"
    style="--bwc-table-height: calc(100vh - 360px);"
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
        key: 'id'
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

    const items = reactive([])
    for (let i=1; i<=80; i++) {
      const data = {
        id: i,
        name: 'name' + i,
        age: i
      }
      for (let j=1; j<=15; j++) {
        data['key' + j] = 'val-'+i+'-'+j
      }
      items.push(data)
    }
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
