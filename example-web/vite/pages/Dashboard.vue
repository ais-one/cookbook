
<template>
  <div class="container">
    <h1>A Hello Vite + Vue 3!</h1>
    <mwc-autocomplete></mwc-autocomplete>
    <vcxwc-web-cam>
      <button slot="button-snap" class="button" id="snap">Take 123</button>
    </vcxwc-web-cam>
    <vcxwc-sign-pad width="200" height="200" v-model="imageDataUrl"></vcxwc-sign-pad>
    <p ref="titleRef">Edit ./App.vue to test hot module replacement (HMR).</p>
    <p>
      <span>Count is: {{ count }}</span>
      <button @click="count++">increment</button>
    </p>
    <p>
    <button @click="testFn">TEST See Console Log</button>      
    </p>
    <mwc-select label="preselected" :value="selected" @change="updateSelected">
      <mwc-list-item value="0">Item 0</mwc-list-item>
      <mwc-list-item value="1">Item 1</mwc-list-item>
      <mwc-list-item value="2">Item 2</mwc-list-item>
    </mwc-select>
    <p>Non-Reactive Data: {{ nonReactiveData }}</p>
    <p>Reactive Data: {{ reactiveData }}</p>
    <p>Vuex Store {{ storeCount }} - {{ storeToken }}</p>
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

export default {
  name: 'Dashboard',
  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // const obj = reactive({ count: 0 })
    const count = ref(0)
    const msg = ref('')
    const imageDataUrl = ref('')
    const titleRef = ref(null)
    let nonReactiveData = 10
    const reactiveData = ref(20)

    const selected = ref(String(2))

    const updateSelected = (e) => selected.value = e.target.value

    // const plusOne = computed(() => count.value + 1)
    const storeCount = computed(() => store.state.count) // ctx.root.$store.myModule.state.blabla
    const storeToken = computed(() => store.state.token)

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
    let timerId
    onMounted(async () => {
      console.log('mounted!')
      // console.log('props', props)
      // console.log('context', context)
      // console.log('useStore', store)
      // console.log('useRouter', router)
      // console.log('useRoute', route)
      console.log("template ref titleRef", titleRef.value)

      // const rv = await axios.get('https://swapi.dev/api/people/1')
      // msg.value = JSON.stringify(rv.data)

      timerId = setInterval(() => {
        console.log('timer fired', String(selected.value))
        nonReactiveData += 1
        reactiveData.value += 1
      }, 200000)
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onBeforeUnmount(() => {
      if (timerId) clearInterval(timerId)
      console.log('before mounted!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })

    const testFn = (e) => {
      console.log('event', e)
      console.log('imageDataUrl', imageDataUrl.value)
    } 

    // // Watch prop value change and assign to value 'selected' Ref
    // watch(() => props.value, (newValue: Props['value']) => {
    //   selected.value = newValue;
    // });
    return {
      nonReactiveData, // non reactive
      reactiveData, // ref reactive
      count, // ref
      msg,
      selected,
      titleRef,
      imageDataUrl,
      storeCount, // store
      storeToken,
      updateSelected,
      testFn // method
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

vcxwc-sign-pad {
  --vcxwc-sign-pad-background-color: #faa;
  --vcxwc-sign-pad-stroke-color: #00f;
}
</style>
