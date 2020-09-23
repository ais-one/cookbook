
<template>
  <div class="container">
    <h1>A Hello Vite + Vue 3!</h1>
    <p ref="titleRef">Edit ./App.vue to test hot module replacement (HMR).</p>
    <p>
      <span>Count is: {{ count }}</span>
      <button @click="count++">increment</button>
    </p>
    <mwc-select label="preselected" :value="selected" @change="updateSelected">
      <mwc-list-item value="0">Item 0</mwc-list-item>
      <mwc-list-item value="1">Item 1</mwc-list-item>
      <mwc-list-item value="2">Item 2</mwc-list-item>
    </mwc-select>
    <p>Non-Reactive Data: {{ nonReactiveData }}</p>
    <p>Reactive Data: {{ reactiveData }}</p>
    <p>Vuex Store {{ storeCount }} - {{ storeToken }}</p>
    <mwc-autocomplete required label="ac-test" v-model="ac" @search="(e)=>autoComplete(e, 'my-col', 'add')"></mwc-autocomplete>
    <p><button @click="doAc">see ac</button>&nbsp;<button @click="setAc">set ac</button></p>
    <mwc-multiselect required label="ms-test" v-model="ms" :options="msOptions"></mwc-multiselect>
    <p>Axios GET {{ msg }}</p>
    <ul>
      <li v-for="n in 50" :key="n">{{ n }}</li>
    </ul>
  </div>
</template>

<script>
// defineComponent, getCurrentInstance, reactive, readonly, watch, watchEffect
// provide, inject ??? 
import { onMounted, onUpdated, onUnmounted, onBeforeUnmount, ref, computed, provide, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { debounce } from '../lib/esm/util.js'

export default {
  name: 'Dashboard',

  setup(props, context) {
    console.log('provide-inject MyTheme', inject('MyTheme'))
    // reactivity
    // // in provider
    // const themeRef = ref('dark')
    // provide(SubThemeSymbol, themeRef)
    // // in consumer
    // const theme = inject(SubThemeSymbol, ref('light'))
    // watchEffect(() => console.log(`theme set to: ${theme.value}`))

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    // const obj = reactive({ count: 0 })
    const count = ref(0)
    const msg = ref('')
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

    const ms = ref('bb,cc')
    const msOptions = ref(JSON.stringify([
      { key: 'aa', text: 'aa11'},
      { key: 'bb', text: 'bb22'},
      { key: 'cc', text: 'cc33'},
      { key: 'dd', text: 'dd44'},
      { key: 'ee', text: 'ee55'},
    ]))

    const ac = ref('aaa0') // autocomplete
    const autoComplete = debounce(async (e, col, _showForm) => {
      console.log('search', e.detail, col, _showForm)
      const result = []
      for (let i=0; i<e.detail.length; i++) {
        result.push('aaa' + i)        
      }
      const mwcAc = document.querySelector('mwc-autocomplete')
      mwcAc.setList(result)
    }, 500)
    const setAc = () => {
      const mwcAc = document.querySelector('mwc-autocomplete')
      mwcAc.value = 'edcba'
      mwcAc.hello()
    }
    const doAc = () => {
      console.log('ac', ac.value)
    }

    let timerId
    onMounted(async () => {
      console.log('dash mounted!', chrome)
      // console.log('props', props)
      // console.log('context', context)
      // console.log('useStore', store)
      // console.log('useRouter', router)
      // console.log('useRoute', route)
      // console.log("template ref titleRef", titleRef.value)

      // const mwcMs = document.querySelector('mwc-multiselect')
      // mwcMs.setList([])

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

    // // Watch prop value change and assign to value 'selected' Ref
    // watch(() => props.value, (newValue: Props['value']) => {
    //   selected.value = newValue;
    // });
    return {
      ms, // multiselect
      msOptions,
      ac, // autocomplete
      doAc,
      setAc,
      autoComplete,
      nonReactiveData, // non reactive
      reactiveData, // ref reactive
      count, // ref
      msg,
      selected,
      titleRef,
      storeCount, // store
      storeToken,
      updateSelected // method
    }
  }
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
}
</style>
