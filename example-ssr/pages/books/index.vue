<template>
  <div>
    <h1>Put example-spa/src/pages/Book.vue Page Here</h1>
    <div @click="gotoPages(1)">Click Here To Go To Page</div>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  name: 'book',
  methods: {
    gotoPages(id) {
      // go to pages table for selected book
      // console.log('gotoPages - BookId: ', id)
      this.$router.push({ path: `/books/${id}/pages` })
    }
  }
}
</script>
