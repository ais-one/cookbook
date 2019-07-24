<template>
  <div class="container">
    <div>
      <h1>{{ title }} <nuxt-link to="/">Go Home</nuxt-link></h1>
      <nuxt />
    </div>
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
