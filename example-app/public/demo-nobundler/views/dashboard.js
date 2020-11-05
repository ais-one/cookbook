const template = /*html*/`
<div>
  <h1>Dashboard</h1>
  <!-- h1 v-for="n of 20">Test</h1 -->
  <bwc-table :columns="columns" :items="items" @rowclick="rowCLick"></bwc-table>
</div>
`

const { onMounted, reactive } = Vue

export default {
  template,
  setup() {
    const columns = reactive([
      {
        label: 'ID',
        key: 'id'
      },     
      {
        label: 'Name',
        key: 'name'
      },     
      {
        label: 'Age',
        key: 'age'
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

    const rowCLick = (e) => {
      console.log('rowCLick', e.detail)
    }

    onMounted(async () => {
      console.log('Dashboard mounted!')
    })
    return {
      columns,
      items,
      rowCLick
    }
  }
}
