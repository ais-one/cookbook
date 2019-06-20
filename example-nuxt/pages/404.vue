<template>
  <div>
    <h1>Custom Not Found.</h1>
    <p>better to use layouts/error.vue, can handle nuxt generated</p>
    <p>cannot handle nuxt 500 error</p>
    <p>Route is {{ $route.path }}</p>
  </div>
</template>

<script>
// for generated, you need http server (S3, GC Storage, etc...) to be able to handle 404 fallback...
export default {
  layout: 'minimal',
  created() {
    console.log(this.$router, this.$route)
  }
}
</script>

<style scoped></style>
