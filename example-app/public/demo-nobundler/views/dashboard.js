const template = /*html*/`
<div>
  <h1>Dashboard</h1>
  <!-- h1 v-for="n of 20">Test</h1 -->
  <bwc-table></bwc-table>
</div>
`

const { onMounted } = Vue

export default {
  template,
  setup() {
    onMounted(async () => {
      console.log('Dashboard mounted!')
    })
    return {
    }
  }
}
