<template>
  <div class="container">
    <h1>Filler Test Page</h1>
    <p>Props Id {{ testId }}</p>
    <p>Route Param: {{ routeParam }}</p>
    <a-button v-if="!routeParam" @click="$router.push(`${$route.path}/111`)">Set Param</a-button>
    <a-button v-else @click="$router.back()">Back</a-button>
    <hr>
    <p>Show a long list to test scrolling</p>
    <ul>
      <li v-for="n in 50" :key="n">{{ n }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  testId: {
    type: Number,
    default: -1,
  },
});

const route = useRoute();
const routeParam = ref(route.params.param);
console.log('props', props);
console.log('route', route);

// TODELETE
// export default {
//   name: 'DemoFiller',
//   props: {
//   },
//   setup(props, context) {
//     // console.log('Filler props', props, context)
//     return {
//       props,
//       routeParam
//     }
//   }
// }
</script>
