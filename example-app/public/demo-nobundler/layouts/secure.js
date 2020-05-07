import Navbar from '../components/navbar.js'

const template = /*html*/`
<section>
  <ms-navbar></ms-navbar>
  <router-view :key="$route.fullPath"></router-view>
</section>
`

export default {
  template,
  components: {
    'ms-navbar': Navbar
  }
}
