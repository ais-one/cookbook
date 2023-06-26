<template>
  <div class="container">
    <h1>Site A - Test VueJS 3</h1>
    <div v-for="(item, i) in list" :key="i" :ref="(el) => (divs[i] = el)">
      {{ item }}
    </div>
    <div class="section">
      <div class="box" style="background-color: red">A</div>
      <div class="box" style="background-color: lightblue">B</div>
      <div class="box" style="background-color: yellow">C</div>
      <div class="box" style="background-color: brown">D</div>
      <div class="box" style="background-color: lightgreen">E</div>
      <div class="box" style="background-color: red">A</div>
      <div class="box" style="background-color: brown">G</div>
    </div>

    <p>
      <span>Count is: {{ count }}</span>
      <button @click="count++">increment</button>
    </p>
    <p>Non-Reactive Data: {{ nonReactiveData }}</p>
    <p>Reactive Data: {{ reactiveData }}</p>
    <p>Vuex Store: {{ store.user }} <button @click="(e) => store.changeUserName('ttt')">Change Name</button></p>
    <h2>Test Reactivity In Object</h2>
    <p>
      Click to see increment. Also check console.log if onUpdated is called
      <button @click="() => testObjectRef.a++">Test Object Ref = {{ testObjectRef.a }}</button>
      <button @click="() => testObjectReactive.a.xx++">Test Object Reactive = {{ testObjectReactive.a.xx }}</button>
    </p>
    <ul>
      <li v-for="n in 15" :key="n">{{ n }}</li>
    </ul>
  </div>
</template>

<script>
// NOSONAR unref, toRef, toRefs, isRef, isProxy, isReactive, isReadonly, defineComponent, getCurrentInstance, reactive, readonly, watch, watchEffect, provide, inject
import { onMounted, onUpdated, onUnmounted, onBeforeUnmount, ref, computed, inject, reactive, onBeforeUpdate } from 'vue'
import { useMainStore } from '/src/store'
import { VITE_PWA_PN } from '/config.js'
import { http } from '/src/services.js'

export default {
  name: 'DemoViewTest',
  setup(props, context) {
    const list = reactive([1, 2, 3])
    const divs = ref([])

    console.log('provide-inject MyTheme', inject('MyTheme'))

    const store = useMainStore()
    const count = ref(0)
    let nonReactiveData = 10
    const reactiveData = ref(20)

    const searchRef = ref(null)
    const searchVal = ref('')
    const searchResult = ref('')

    const testObjectRef = ref({ a: 10, b: 20, c: 30 })
    const testObjectReactive = reactive({ a: { xx: 40 }, b: 50, c: 60 })

    const pnSubState = ref('unsub')

    onBeforeUpdate(() => {
      divs.value = []
    })
    const makeRef = (el, i) => {
      divs[i] = el
    }

    let timerId
    onMounted(async () => {
      console.log('demomain mounted!')
      // NOSONAR
      // console.log('props', props)
      // console.log('context', context)
      // console.log('useStore', store)
      // console.log('useRouter', router)
      // console.log('useRoute', route)
    })
    onBeforeUnmount(() => {
      // / console.log('demomain before unmount!')
    })
    onUpdated(() => console.log('demomain updated!'))
    onUnmounted(() => console.log('demomain unmounted!'))

    const testApi = async (test) => {
      try {
        const { data } = await http.get('/api/' + test)
        console.log('testApi', data)
      } catch (e) {
        console.log('testApi err', e)
      }
    }

    return {
      testObjectReactive,
      testObjectRef,

      makeRef,
      list,
      divs,

      nonReactiveData, // non reactive
      reactiveData, // ref reactive
      count, // ref

      store,
      testApi, // test API

      pnSubState,
      VITE_PWA_PN,

      searchRef, // rxjs search value
      searchVal,
      searchResult
    }
  }
}
</script>

<style lang="css" scoped>
.section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-around;
}

.box {
  width: 200px;
  /* border: 3px solid rgba(0,0,0,.2); */
  /* flex: 1 0 21%; */
  /* width: 25%; */
  margin: 5px;
  height: 100px;
  background-color: blue;
}
</style>
