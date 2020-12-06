const template = /*html*/`
<div>
  <h1>Dashboard</h1>
  <h3 v-for="n of 20">Test {{ n }}</h3>
</div>
`

const { onMounted } = Vue

export default {
  template,
  setup() {
    onMounted(async () => {
      console.log('Dashboard mounted!')
    })
    return {}
  }
}
