<template>
  <div>
    <h1>A Test Application For Vite</h1>
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
