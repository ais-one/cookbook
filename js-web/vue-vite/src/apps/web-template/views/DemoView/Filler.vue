<template>
  <div class="container">
    <h1>Filler Test Page</h1>
    <p>Props Id {{ testId }}</p>
    <p>Route Param: {{ routeParam }}</p>
    <a-button v-if="!routeParam" @click="$router.push($route.path + '/111')">Set Param</a-button>
    <a-button v-else @click="$router.back()">Back</a-button>
    <hr />
    <p>Show a long list to test scrolling</p>
    <ul>
      <li v-for="n in 50" :key="n">{{ n }}</li>
    </ul>
  </div>
</template>

<script>
// NOSONAR unref, toRef, toRefs, isRef, isProxy, isReactive, isReadonly, defineComponent, getCurrentInstance, reactive, readonly, watch, watchEffect, provide, inject
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'DemoViewFiller',
  props: {
    testId: {
      type: Number,
      default: -1
    }
  },
  setup(props, context) {
    const route = useRoute()
    const routeParam = ref(route.params.param)
    console.log('props', props)
    console.log('route', route)

    // console.log('Filler props', props, context)
    return {
      props,
      routeParam
    }
  }
}
</script>
