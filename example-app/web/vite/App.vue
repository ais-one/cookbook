<template>
  <div>
    <h1>A Test Application For Vite</h1>
     <!-- <button class="button">Button</button> -->
    <router-view></router-view>
  </div>
</template>

<script>
// :key="$route.fullPath" // this is causing problems
export default {
  methods: {
    clickMe () {
      alert('Clicked')
    }
  }
}
</script>

<style scoped>
</style>
