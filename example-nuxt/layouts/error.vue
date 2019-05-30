<template>
  <div>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <p>Route path is {{ $route.path }}</p>
    <p>Route query is {{ $route.query }}</p>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default',
  mounted() {
    alert('You can do a redirect also when mounted')
  }
}
</script>
