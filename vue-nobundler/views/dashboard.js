const template = /*html*/`
<div>
  <h1>Dashboard (Count: {{ statex.counter }})</h1>
  <button class="button" @click.stop.prevent="increment">Increment</button>
  <h3 v-for="n of 20">Test {{ n }}</h3>
</div>
`
import { statex } from '../store.js'
const { onMounted } = Vue

export default {
  template,
  setup() {
    onMounted(async () => {
      console.log('Dashboard mounted!')
    })
    const increment = () => {
      statex.counter += 1
    }
    return {
      increment,
      statex
    }
  }
}
