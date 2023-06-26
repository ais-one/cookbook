<template>
  <div class="container">
    <h1>Filler Test Page</h1>
    <p>Route Id: {{ routeId }}</p>
    <a-button v-if="!routeId" @click="$router.push($route.path + '/111')">Go</a-button>
  </div>
</template>

<script>
// NOSONAR unref, toRef, toRefs, isRef, isProxy, isReactive, isReadonly, defineComponent, getCurrentInstance, reactive, readonly, watch, watchEffect, provide, inject
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'DemoViewFiller',
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const routeId = ref(route.params.id)
    // / route.path.value
    // const routeId = ref('a123')
    console.log(route)

    // console.log('Filler props', props, context)
    const title = ref('123')
    return {
      routeId
    }
  }
}
</script>
