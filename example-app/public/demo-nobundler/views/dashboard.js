const template = /*html*/`
<div>
  <h1>Dashboard</h1>
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
