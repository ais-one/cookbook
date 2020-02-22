<template>
  <div>
    <h1>Error handling methods</h1>
    <p>better to use layouts/error.vue, can handle nuxt generated</p>

    <pre>
      // Method 1:
      // better not to use this for 404 handling, use generate.fallback
      // 500 and nuxt generate has problems, cannot catch
      router: {
        extendRoutes(routes, resolve) {
          routes.push({
            name: 'custom404', path: '*', component: resolve(__dirname, 'pages/404.vue')
          })
        }
      },
      // Method 2:
      _.vue catch All, but useless when using nuxt generated, cannot catch
    </pre>
  </div>
</template>

<script>
// for generated, you need http server (S3, GC Storage, etc...) to be able to handle 404 fallback...
export default {
  layout: 'minimal',
  created() {
    // console.log(this.$router, this.$route)
  }
}
</script>

<style scoped></style>
