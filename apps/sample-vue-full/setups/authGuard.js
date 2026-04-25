import { useMainStore } from '../store';

// TODO import { http } from '@common/vue/plugins/fetch'
const { VITE_API_URL } = import.meta.env;

// const permissions = {
//   // g1 = route groups, g2 = user roles
//   // go through each route group... check if group matches [list of roles in user]
//   allowed: (g1, g2) => g1.find(x => g2.includes(x))
// }

// const routeGroups = {
//   // '/authors', '/categories', '/books', '/pages', '/books/:id/pages'
//   '/test': ['TestGroup'] //
// }

const { VITE_INITIAL_SECURE_PATH, VITE_INITIAL_PUBLIC_PATH } = import.meta.env;

export const authGuard = async (to, from, next) => {
  const store = useMainStore();

  const previouslyLoggedIn = async () => {
    return false;
    // let result = false
    // const store = useMainStore()

    // // check if user previously logged in (has token in cookies)
    // const response = await http.get(`${VITE_API_URL}/auth/verify`)
    // if (response.status == 200) {
    //   const user = response.data.data.user
    //   store.user = user
    //   result = true
    // }
    // return result
  };

  // TODO find users from localStorage? // potential security leak
  // const item = localStorage.getItem('session') // survive a refresh - POTENTIAL SECURITY RISK - TO REVIEW AND CHANGE USE HTTPONLY COOKIES
  // if (item) {
  //   const user = JSON.parse(item)
  //   store.commit('setUser', user) // need user.token only
  // }

  const loggedIn = !!store.user;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // const { roles } = store.state.user
  // if (routeGroups[to.matched[0].path]) {
  //   let found = permissions.allowed(routeGroups[to.matched[0].path], roles.split(','))
  //   if (!found) {
  //     alert('Forbidden... Check Page Permissions')
  //     return next('/')
  //   }
  // }
  if (loggedIn === requiresAuth) {
    next();
  } else if (!loggedIn && requiresAuth) {
    const result = await previouslyLoggedIn();
    if (result) {
      next();
    } else {
      next(VITE_INITIAL_PUBLIC_PATH);
    }
  } else if (loggedIn && !requiresAuth) {
    next(VITE_INITIAL_SECURE_PATH);
  } else {
    // should not get here
    console.log('router should not get here', loggedIn, requiresAuth);
  }
};
