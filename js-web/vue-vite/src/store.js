import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from './router.js'
import { http } from '/src/services.js'
// import aaa from 'https://unpkg.com/swrv@0.3.0/esm/index.js' - will error
import { INITIAL_SECURE_PATH, INITIAL_PUBLIC_PATH } from '/config.js'

// name of the store
// it is used in devtools and allows restoring state
export const useMainStore = defineStore('main', () => {
  const user = ref(null)
  // actions
  async function doLogin(payload) {
    if (payload) {
      if (payload.forced) {
        //  forced - refresh token error
        user.value = null
        await router.push(INITIAL_PUBLIC_PATH)
      } else {
        // sign in ok
        user.value = { ...payload }
        await router.push(INITIAL_SECURE_PATH)
      }
    } else {
      // sign in failed
      // console.log('payload forced === false')
      try {
        await http.get('/api/auth/logout')
        user.value = null
        await router.push(INITIAL_PUBLIC_PATH)
      } catch (e) {
        if (e.toString() === 'TypeError: Failed to fetch' || (e.data && e.data.message !== 'Token Expired Error')) {
          user.value = null
          await router.push(INITIAL_PUBLIC_PATH)
        }
      }
    }
  }
  function changeUserName(newName) {
    if (user.value && newName) {
      user.value.id = newName
    }
  }
  return { user, doLogin, changeUserName }
})
