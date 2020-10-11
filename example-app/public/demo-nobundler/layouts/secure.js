import Navbar from '../components/navbar.js'

const template = /*html*/`
<section>
  <h1>Secure Layout</h1>
  <ms-navbar></ms-navbar>
  <router-view></router-view>
</section>
`

export default {
  template,
  components: {
    'ms-navbar': Navbar
  }
}
