// import Navbar from '../components/navbar.js'

const template = /*html*/`
<nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item">
      <span class="icon is-medium p-2" role="button" @click="clickLogo">
        <i class="fas fa-bars"></i>
      </span>
      <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
    </a>
    <!-- a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarTopMenu" @click="clickBurger">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a -->
  </div>
  <div id="navbarTopMenu" class="navbar-menu">
    <!--
    <div class="navbar-start">
      <a class="navbar-item">Home</a>
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">More</a>
        <div class="navbar-dropdown">
          <a class="navbar-item">About</a>
          <hr class="navbar-divider">
          <a class="navbar-item">Report an issue</a>
        </div>
      </div>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a class="button is-light" @click="logout">Logout</a>
        </div>
      </div>
    </div>
    -->
  </div>
</nav>

<div class="columns main">
  <aside v-show="showSide" class="menu nice-scroll">
    <p class="menu-label">General</p>
    <ul class="menu-list">
      <li><router-link :to="{ path: '/dashboard' }">Dashboard</router-link></li>
      <li><router-link :to="{ path: '/ui1' }">UI1 - Autocomplete</router-link></li>
      <li><router-link :to="{ path: '/ui2' }">UI2 - T4T Table</router-link></li>
      <li><router-link :to="{ path: '/ui3' }">UI3 - T4T Form</router-link></li>
      <li><router-link :to="{ path: '/ui4' }">UI4 - T4T Table & Form</router-link></li>
      <li><router-link :to="{ path: '/admin' }">Admin</router-link></li>
    </ul>
    <ul class="menu-list">
      <li><a class="button is-light has-text-left" @click="logout">Logout</a></li>
    </ul>
    <p class="menu-label">Administration</p>
    <ul class="menu-list">
      <li><a>Team Settings</a></li>
      <li>
        <a @click="menu0 = !menu0">{{ menu0 ? '+' : '-' }} Manage Your Team</a>
        <ul v-show="menu0">
          <li><a>Managers</a></li>
          <li><a>Members</a></li>
        </ul>
      </li>
      <li>
        <a @click="menu1 = !menu1">{{ menu1 ? '+' : '-' }} Tests</a>
        <ul v-show="menu1">
          <li v-for="n of 30"><a>Testing</a></li>
        </ul>
      </li>
    </ul>
  </aside>
  <div class="column content nice-scroll">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</div>
`

const { onMounted, onUnmounted, ref } = Vue
const { useStore } = Vuex
const { useRouter } = VueRouter

export default {
  template,
  // components: {
  //   'ms-navbar': Navbar
  // },
  setup() {
    const store = useStore()
    const router = useRouter()
    const showSide = ref(true)
    const menu0 = ref(false)
    const menu1 = ref(false)

    onMounted(async () => {
      console.log('Secure mounted!')
    })
    onUnmounted(async () => {
      console.log('Secure unmounted!')
    })
    const clickBurger = () => {
      // console.log('showSide.value', showSide.value)
      // const elNavbarBurger = document.querySelector('.navbar-burger')
      // const elNavbarMenu = document.querySelector('.navbar-menu')
      // const elMainContent = document.querySelector('.main > .content')
      // showSide.value = !showSide.value
      // if (showSide.value) {
      //   elMainContent.style.width = 'calc(100vw - 218px)'
      // } else {
      //   elMainContent.style.width = '100vw'
      // }
      // elNavbarBurger.classList.toggle("is-active")
      // elNavbarMenu.classList.toggle("is-active")
    }
    const clickLogo = () => {
      const elMainContent = document.querySelector('.main > .content')
      showSide.value = !showSide.value
      if (showSide.value) {
        elMainContent.style.width = 'calc(100vw - 218px)'
      } else {
        elMainContent.style.width = '100vw'
      }
    }
    const logout = () => {
      store.commit('setUser', null)
      router.push('/') // if /dashboard should be kicked back to / 
    }
    return {
      clickLogo,
      clickBurger,
      showSide,
      menu0,
      menu1,
      logout
    }
  }
}
