<template>
  <div class="container">
    <h1>Site A - Test VueJS 3</h1>
    <!-- <div v-for="(item, i) in list" :key="i" :ref="(el) => { divs[i] = el }"> -->
    <!-- <div v-for="(item, i) in list" :key="i" :ref="(el) => makeRef(el, i)"> -->
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
    <p><button @click="(e) => testApi('healthcheck')">Test API</button> <button @click="(e) => testApi('health-auth')">Test API Auth</button></p>
    <p>Non-Reactive Data: {{ nonReactiveData }}</p>
    <p>Reactive Data: {{ reactiveData }}</p>
    <p>Vuex Store {{ storeCount }} - {{ storeUser }}</p>
    <h2>Test Push Notifications using [{{ VITE_PWA_PN }}]</h2>
    <p>PN State: {{ pnSubState }}</p>
    <p><button @click="subPn">Sub PN</button>&nbsp;<button @click="unsubPn">Unsub PN</button>&nbsp;<button @click="testPn">Test PN</button></p>
    <h2>Test Search and rxjs</h2>
    <a-input ref="searchRef" placeholder="rxjs search swapi"></a-input>
    {{ searchResult || 'No Search Result' }}
    <h2>Test Reactivity In Object</h2>
    <p>
      Click to see increment. Also check console.log if onUpdated is called
      <button @click="() => testObjectRef.a++">Test Object Ref = {{ testObjectRef.a }}</button>
      <button @click="() => testObjectReactive.a.xx++">Test Object Reactive = {{ testObjectReactive.a.xx }}</button>
    </p>
    <ul>
      <li v-for="n in 10" :key="n">{{ n }}</li>
    </ul>
  </div>
</template>

<script>
// NOSONAR unref, toRef, toRefs, isRef, isProxy, isReactive, isReadonly, defineComponent, getCurrentInstance, reactive, readonly, watch, watchEffect, provide, inject
import { onMounted, onUpdated, onUnmounted, onBeforeUnmount, ref, computed, inject, reactive, onBeforeUpdate } from 'vue'
import { useStore } from 'vuex'
import { webpushSubscribe, webpushUnsubscribe } from '/@es-labs/esm/pwa.js' // served from express /esm static route
import { fcmSubscribe } from '/src/fcm.js'
import { VITE_PWA_PN } from '/config.js'
import { http } from '/src/services.js'

import { fromEvent } from 'rxjs'
import { switchMap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators'

export default {
  name: 'DemoMain',
  setup(props, context) {
    const list = reactive([1, 2, 3])
    const divs = ref([])

    console.log('provide-inject MyTheme', inject('MyTheme'))

    // NOSONAR reactivity
    // // in provider
    // const themeRef = ref('dark')
    // provide(SubThemeSymbol, themeRef)
    // // in consumer
    // const theme = inject(SubThemeSymbol, ref('light'))
    // watchEffect(() => console.log(`theme set to: ${theme.value}`))
    // const route = useRoute()
    // const router = useRouter()
    // const obj = reactive({ count: 0 })

    const store = useStore()
    const count = ref(0)
    let nonReactiveData = 10
    const reactiveData = ref(20)

    const searchRef = ref(null)
    const searchVal = ref('')
    const searchResult = ref('')

    const testObjectRef = ref({ a: 10, b: 20, c: 30 })
    const testObjectReactive = reactive({ a: { xx: 40 }, b: 50, c: 60 })

    const storeCount = computed(() => store.state.count) // ctx.root.$store.myModule.state.blabla
    const storeUser = computed(() => store.state.user)

    const pnSubState = ref('unsub')

    // NOSONAR
    // const plusOne = computed(() => count.value + 1)
    // const stop = watchEffect(() => console.log(count.value))
    // // -> logs 0
    // setTimeout(() => {
    //   count.value++
    //   // -> logs 1
    // }, 100)
    // // stop()
    //
    // put watchEffect inside onMounted to have access to DOM
    // // watching a getter
    // const state = reactive({ count: 0 })
    // watch(
    //   () => state.count,
    //   (count, prevCount) => {
    //   }
    // )
    //
    // // directly watching a ref
    // const count = ref(0)
    // watch(search, (newVal, prevVal) => {
    //   console.log('watch search', newVal)
    // })
    //
    // // Watch prop value change and assign to value 'selected' Ref
    // watch(() => props.value, (newValue: Props['value']) => {
    //   selected.value = newValue;
    // });
    //
    // watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    // })
    //
    // watch(
    //   () => object_or_primitive_being_watched,
    //   (state, prevState) => {
    //     console.log(
    //       "deep ",
    //       state.attributes.name,
    //       prevState.attributes.name
    //     );
    //   },
    //   { deep: true }
    // )
    // watchEffect ... ?

    // make sure to reset the refs before each update
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

      timerId = setInterval(() => {
        console.log('timer fired')
        nonReactiveData += 1
        reactiveData.value += 1
      }, 200000)

      const input$ = fromEvent(searchRef.value.$el, 'input') // NOSONAR
        .pipe(
          debounceTime(1000),
          map((e) => e.target.value),
          // .filter(value => value.length >= 2)
          distinctUntilChanged(),
          switchMap((search) =>
            fetch('https://swapi.dev/api/people/?search=' + search + '&format=json')
              .then((res) => res.json())
              .then((data) => data)
          )
          // catchError(handleErrorByReturningObservable)
        )
        .subscribe((e) => {
          searchResult.value = JSON.stringify(e)
          console.log(e)
        })
    })
    onBeforeUnmount(() => {
      if (timerId) clearInterval(timerId)
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

    const subPn = async () => {
      console.log(VITE_PWA_PN)
      try {
        let subscription
        if (VITE_PWA_PN === 'FCM') {
          subscription = await fcmSubscribe(window.SW_REG, async (token) => {
            await http.post('/api/webpush/sub', { subscription: token })
          })
        } else if (VITE_PWA_PN === 'Webpush') {
          const { data } = await http.get('/api/webpush/vapid-public-key')
          subscription = await webpushSubscribe(data.publicKey)
        }
        if (subscription) await http.post('/api/webpush/sub', { subscription })
        pnSubState.value = 'sub'
      } catch (e) {
        console.log('subPn', e)
      }
    }

    const unsubPn = async () => {
      // No FCM Unsub
      try {
        if (VITE_PWA_PN === 'Webpush') await webpushUnsubscribe()
        await http.post('/api/webpush/unsub', {})
        pnSubState.value = 'unsub'
      } catch (e) {
        console.log('unsubPn', e)
      }
    }

    const testPn = async () => {
      if (pnSubState.value !== 'sub') return alert('Need to subscribe first')
      try {
        let data
        console.log('testPn VITE_PWA_PN', VITE_PWA_PN)
        if (VITE_PWA_PN === 'FCM') data = { title: 'Hello', body: new Date().toLocaleString() }
        else if (VITE_PWA_PN === 'Webpush') data = 'Hello ' + new Date().toLocaleString()
        console.log('testPn data', data)
        await http.post('/api/webpush/send/1', { mode: VITE_PWA_PN, data })
      } catch (e) {
        console.log('testPn', e)
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

      storeCount, // store
      storeUser,
      testApi, // test API

      subPn, // push notifications
      unsubPn,
      testPn,
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
