import { store } from '../store'

export default (to, from, next) => {
  if (store.getters.user && store.getters.user.verified) { // has user && otp is verified
    next()
  } else {
    next('/')
  }
}
