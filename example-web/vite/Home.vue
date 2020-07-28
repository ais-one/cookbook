
<template>
  <div>
    [<router-link to="/site-a">Site A</router-link>] [<router-link to="/site-b">Site B</router-link>]
    <h1>A Hello Vite + Vue 3!</h1>
    <p ref="titleRef">Edit ./App.vue to test hot module replacement (HMR).</p>    
    <p>
      <span>Count is: {{ count }}</span>
      <button @click="count++">increment</button>
      <vaadin-button @click="count++">Add</vaadin-button>
    </p>
    <p>Vuex Store {{ storeCount }}</p>
    <p>Axios GET {{ msg }}</p>
    <ul>
      <li v-for="n in 50" :key="n">{{ n }}</li>
    </ul>
  </div>
</template>

<script>
// defineComponent, getCurrentInstance, reactive, readonly, watch, watchEffect
// provide, inject ??? 
import { onMounted, onUpdated, onUnmounted, onBeforeUnmount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

// import axios from '/web_modules/axios.js'
// import axios from 'axios'
import '@vaadin/vaadin-button'

export default {
  // name: 'Home',
  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // const obj = reactive({ count: 0 })
    const count = ref(0)
    const msg = ref('')
    const titleRef = ref(null)

    // const plusOne = computed(() => count.value + 1)
    const storeCount = computed(() => store.state.count) // ctx.root.$store.myModule.state.blabla

    // const stop = watchEffect(() => console.log(count.value))
    // // -> logs 0
    // setTimeout(() => {
    //   count.value++
    //   // -> logs 1
    // }, 100)
    // // stop()

    // put watchEffect inside onMounted to have access to DOM

    // // watching a getter
    // const state = reactive({ count: 0 })
    // watch(
    //   () => state.count,
    //   (count, prevCount) => {
    //   }
    // )

    // // directly watching a ref
    // const count = ref(0)
    // watch(count, (count, prevCount) => {
    // })

    // watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    // })

    onMounted(async () => {
      console.log('mounted!')
      console.log('props', props)
      console.log('context', context)
      console.log("template ref titleRef", titleRef.value)
      // const rv = await axios.get('https://swapi.dev/api/people/1')
      // msg.value = JSON.stringify(rv.data)
      console.log('useStore', store)
      console.log('useRouter', router)
      console.log('useRoute', route)
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onBeforeUnmount(() => {
      console.log('before mounted!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
    return {
      count,
      msg,
      titleRef,
      storeCount
    }
  }
  // data: () => ({ count: 0, msg: '' }),
  // async mounted () {
  //   console.log('mounted')
  //   const rv = await axios.get('https://swapi.dev/api/people/1')
  //   this.msg = JSON.stringify(rv.data)
  //   console.log(this.$router, this.$store)
  // },
  // created () {
  //   console.log('created')
  // }
}
</script>

<style scoped>
h1 {
  color: #4fc08d;
}

h1, p {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
