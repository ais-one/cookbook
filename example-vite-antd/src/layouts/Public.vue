<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'

export default {
  setup(props, context) {
    onMounted(() => console.log('PUBLIC mounted!'))
    onUnmounted(() => console.log('PUBLIC unmounted'))
  }
}
</script>
