const template = /*html*/`
<div>
  <h1>Admin</h1>
</div>
`

const { onMounted } = Vue

export default {
  template,
  setup() {
    onMounted(async () => {
      console.log('Admin mounted!')
    })
    return {
    }
  }
}
