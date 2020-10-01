<template>
  <router-view></router-view>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'

export default {
  setup(props, context) {
    onMounted(() => console.log('PUBLIC mounted!'))
    onUnmounted(() => console.log('PUBLIC unmounted'))
  }
}
</script>
