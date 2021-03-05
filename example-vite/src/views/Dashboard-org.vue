<template>
  <div class="container">
    <h1>A Hello Vite + Vue 3!</h1>
  </div>
</template>

<script>
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  name: 'Dashboard',
  setup() {
    onMounted(async () => console.log('dash mounted!'))
    onUpdated(() => console.log('dash updated!'))
    onUnmounted(() => console.log('dashboard unmounted!'))

    return {
    }
  }
}
</script>

<style scoped>
h1 {
  color: #4fc08d;
}

h1,
p {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
