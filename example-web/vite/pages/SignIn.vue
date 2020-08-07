
<template>
  <div class="page-flex">
    <form class="form-box-flex">
      <h1>Sign In</h1>
      <mwc-textfield label="Username" outlined type="text" v-model="username"></mwc-textfield>
      <mwc-textfield label="Password" outlined type="password" v-model="password"></mwc-textfield>
      <div class="buttons-box-flex">
        <mwc-button raised label="Login" @click="login"></mwc-button>
      </div>
      <p>[<router-link to="/">Home</router-link>]</p>
    </form>  
  </div>
</template>

<script>
import { onMounted, onUpdated, onUnmounted, onBeforeUnmount, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup(props, context) {
    const store = useStore()
    
    const username = ref('Test')
    const password = ref('1234')
    const login = () => store.dispatch('doLogin', username.value)
    return {
      username, // data
      password,
      login, // method
    }
  }
}
</script>

<style scoped>

.page-flex h1, .page-flex p {
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
  height: 320px;
  width: 320px;

  display: flex; 
  flex-direction: column; 
  flex: 0 0 auto; 
  
  border: 1px solid; 
  border-radius: 5px;
  padding: 15px;
  background: lightgray;
}

.form-box-flex mwc-textfield, .form-box-flex mwc-button {
  margin-top: 15px;
}

.form-box-flex mwc-textfield {
  flex: 1 1 auto;
  font-size: 20px;
}

.buttons-box-flex {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.buttons-box-flex mwc-button {
  flex: 0 1 95px;
  font-size: 20px;
}

</style>
