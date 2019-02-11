<template>
<div class="container d-flex align-items-center justify-content-center flex-column">
  <!-- <img src="~/assets/loading.svg" alt="Loading..." width="80px" /> -->
  Logging in...
</div>
</template>

<script>
// GET /applications/:client_id/tokens/:access_token
export default {
  mounted() {
    // document.onbeforeunload = function() {
    //   // return 'Are you sure you want to leave?'
    //   console.log('UNLOADING')
    // }
    console.log('CB', this, this.$route.query.code, this.$route.query.state)
    console.log('ACB', this.$auth.loggedIn)
    // window.location.href = '#'
    // window.location.href = 'http://www.google.com'
    // this.$router.push('http://www.google.com/')
    // this.$router.push('/secure')
  }
}
</script>

<style scoped>
.container {
  min-height: 70vh;
}
</style>
