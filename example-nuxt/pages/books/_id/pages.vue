<template>
  <div>
    <h1>Put example-rest/src/pages/Page.vue Page Here</h1>
    <div>Page {{ $route.params.id }}</div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  name: 'book-pages'
}
</script>
