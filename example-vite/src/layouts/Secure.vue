<template>
  <mwc-drawer hasHeader type="modal">
    <span slot="title" class="h-center"><img class="text-center" src="https://via.placeholder.com/150x50" alt="My Dashboard" /></span>
    <span slot="subtitle" class="h-center"><p>v0.0.1</p></span>
    <div class="drawer-content">
      <mwc-list>
        <mwc-list-item graphic="icon" @click="logout">
          <slot>Sign out</slot>
          <mwc-icon slot="graphic">exit_to_app</mwc-icon>
        </mwc-list-item>
        <div v-for="item of menuItems" :key="item.name">
          <router-link v-if="item.to" :to="item.to">
            <mwc-list-item graphic="icon" @click="theDrawer.open = false">
              <slot>{{ item.name }}</slot>
              <mwc-icon slot="graphic">{{ item.icon }}</mwc-icon>
            </mwc-list-item>
          </router-link>
          <div v-else>
            <mwc-list-item hasMeta @click="item.show = !item.show">
              <span>{{ item.name }}</span>
              <mwc-icon slot="meta">{{ item.show ? item.icon0 : item.icon1 }}</mwc-icon>
            </mwc-list-item>
            <div v-if="item.show">
              <router-link v-for="child of item.children" :key="child.to" :to="child.to">
                <mwc-list-item graphic="icon" @click="theDrawer.open = false">
                  <slot>{{ child.name }}</slot>
                  <mwc-icon slot="graphic">{{ child.icon }}</mwc-icon>
                </mwc-list-item>
              </router-link>
            </div>
          </div>
        </div>
      </mwc-list>
    </div>
    <div slot="appContent">
      <mwc-top-app-bar-fixed>
        <mwc-icon-button slot="navigationIcon" icon="menu"></mwc-icon-button>
        <div slot="title">Title</div>
        <mwc-icon-button slot="actionItems" icon="cast"></mwc-icon-button>
        <mwc-icon-button slot="actionItems" icon="fingerprint"></mwc-icon-button>
      </mwc-top-app-bar-fixed>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </mwc-drawer>
</template>

<script>
// :key="$route.fullPath" // this is causing problems
import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup(props, context) {
    const store = useStore()

    const theDrawer = ref(null)

    onMounted(async () => {
      console.log('SECURE mounted!')
      // addEventListener('load', () => { document.body.classList.remove('unresolved'); });
      const drawer = document.getElementsByTagName('mwc-drawer')[0]
      if (drawer) {
        const container = drawer.parentNode
        container.addEventListener('MDCTopAppBar:nav', () => {
          drawer.open = !drawer.open
        })
        theDrawer.value = drawer
      }
    })
    onUnmounted(() => console.log('SECURE unmounted'))
    const menuItems = ref([
      { to: '/dashboard', name: 'Dashboard', icon: 'home' },
      {
        show: true,
        name: 'Sites',
        icon0: 'keyboard_arrow_up',
        icon1: 'keyboard_arrow_down',
        children: [
          { to: '/demo-flex', name: 'Demo Flex', icon: '' },
          { to: '/table-person?k=123', name: 'Person Table', icon: '' },
          { to: '/table-country', name: 'Country Table', icon: '' },
          { to: '/table-grade-slot', name: 'Grade Table (Slot)', icon: '' },
          { to: '/demo-map', name: 'Demo Map', icon: '' },
          { to: '/demo-chart', name: 'Demo Chart', icon: 'bar_chart' },
          { to: '/demo-web-cam', name: 'Demo Web Cam', icon: '' },
          { to: '/demo-sign-pad', name: 'Demo Sign Pad', icon: '' }
        ]
      },
      { to: '/dashboard', name: 'Dashboard', icon: 'home' },
      { to: '/dashboard', name: 'Dashboard', icon: 'home' },
      { to: '/dashboard', name: 'Dashboard', icon: 'home' },
      { to: '/dashboard', name: 'Dashboard', icon: 'home' },
      { to: '/dashboard', name: 'Dashboard', icon: 'home' },
      { to: '/dashboard', name: 'Dashboard', icon: 'home' }
    ])
    const logout = async () => await store.dispatch('doLogin', null)

    return {
      menuItems, // ref,
      theDrawer,
      logout // method
    }
  }
}
</script>

<style scoped>
mwc-drawer {
  --mdc-theme-primary: green;
  z-index: 10000;
}
</style>
