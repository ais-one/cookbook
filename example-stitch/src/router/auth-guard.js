import { store } from '../store'

export default (to, from, next) => {
  if (store.getters.user) {
    next()
  } else {
    next('/')
  }
}
