<template>
  <div class="container">
    <h1>{{ title }} <nuxt-link to="/">Go Home</nuxt-link></h1>
    <nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Minimal Layout'
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
