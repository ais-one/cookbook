<template>
  <div>
    <h1>Put example-spa/src/pages/Page.vue Page Here</h1>
    <div>Page {{ $route.params.id }}</div>
  </div>
</template>

<script>
export default {
  middleware: ['auth-guard'],
  name: 'book-pages'
}
</script>
