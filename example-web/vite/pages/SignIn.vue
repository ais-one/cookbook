<template>
  <div class="page-flex">
    <form class="form-box-flex">
      <h1>Sign In</h1>
      <mwc-textfield label="Username" outlined type="text" v-model="username"></mwc-textfield>
      <mwc-textfield label="Password" outlined type="password" v-model="password"></mwc-textfield>
      <div class="buttons-box-flex">
        <mwc-button raised label="Login" @click="login"></mwc-button>
      </div>
      <p><router-link to="/signup">Sign Up</router-link></p>
    </form>  
    <mwc-autocomplete v-model="ac" @search="(e)=>autoComplete(e, 'my-col', 'add')"></mwc-autocomplete>
    <p><button @click="doAc">see ac</button></p>
    <p><button @click="setAc">set ac</button></p>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
// import { useRouter, useRoute } from 'vue-router'
import { debounce } from 'http://127.0.0.1:3000/js/util.js'

export default {
  setup(props, context) {
    const store = useStore()
    
    const username = ref('Test')
    const password = ref('1234')
    const ac = ref('abcde')

    onMounted(async () => {
    })

    const autoComplete = debounce(async (e, col, _showForm) => {
      console.log('search', e.detail, col, _showForm)
      const result = []
      for (let i=0; i<e.detail.length; i++) {
        result.push('aaa' + i)        
      }
      // recordObj[_showForm][col] = e.target.value
      // try {
      //   const { dbName, tableName, limit, key, text, parentTableColName, parentCol } = tableCfg.value.cols[col].options
      //   const query = {
      //     dbName, tableName, limit, key, text, search: e.target.value
      //   }
      //   if (parentTableColName) {
      //     query['parentTableColName'] = parentTableColName
      //     query['parentTableColVal'] = recordObj[_showForm][parentCol]
      //   }
      //   recordObj[_showForm+'Ac'][col] = await httpGet('/api/t4t/autocomplete', query)
      // } catch (err) {
      //   recordObj[_showForm+'Ac'][col] = []
      //   console.log('autoComplete', err.message)
      // }
      const mwcAc = document.querySelector('mwc-autocomplete')
      mwcAc.setList(result)
    }, 500)

    const login = () => store.dispatch('doLogin', username.value)
    const setAc = () => {
      const mwcAc = document.querySelector('mwc-autocomplete')
      mwcAc.value = 'edcba'
      mwcAc.hello()
    }
    const doAc = () => {
      console.log('ac', ac.value)
    }
    return {
      ac,
      doAc,
      setAc,
      autoComplete,
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
