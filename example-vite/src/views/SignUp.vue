<template>
  <div class="page-flex">
    <form class="form-box-flex">
      <h1>Sign Up</h1>
      <p>Not Yet Ready</p>
      <p><router-link to="/signin">Sign In</router-link></p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  setup(props, context) {
    return {}
  }
}
</script>

<style scoped>
.page-flex h1,
.page-flex p {
  text-align: center;
}

.page-flex {
  display: flex;
  flex-direction: row;
  height: calc(100vh);
  justify-content: center;
  align-items: center;
}

.form-box-flex {
  /* height: 320px; */
  width: 320px;

  display: flex;
  flex-direction: column;
  flex: 0 0 auto;

  border: 1px solid;
  border-radius: 5px;
  padding: 15px;
  background: lightgray;
}
</style>
