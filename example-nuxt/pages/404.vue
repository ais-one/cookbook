<template>
  <h1>Custom Not Found</h1>
</template>

<script>
// for generated, you need http server (S3, GC Storage, etc...) to be able to handle 404 fallback...
export default {
  created() {
    console.log(this.$router, this.$route)
  }
}
</script>

<style scoped></style>
