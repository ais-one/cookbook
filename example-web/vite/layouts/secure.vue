<template>
  <mwc-drawer hasHeader type="modal">
    <span slot="title" class="h-center"><img class="text-center" src="http://via.placeholder.com/150x50" alt="My Dashboard"></span>
    <span slot="subtitle" class="h-center"><p>v0.0.1</p></span>
    <div class="drawer-content">
      <mwc-list>
        <div v-for="item of menuItems" :key="item.name">
          <router-link v-if="item.to" :to="item.to">
            <mwc-list-item graphic="icon">
              <slot>{{ item.name }}</slot><mwc-icon slot="graphic">{{ item.icon }}</mwc-icon>
            </mwc-list-item>
          </router-link>
          <div v-else>
            <mwc-list-item hasMeta @click="item.show=!item.show">
              <span>{{ item.name }}</span>
              <mwc-icon slot="meta">{{ item.show ? item.icon1 : item.icon0 }}</mwc-icon>
            </mwc-list-item>
            <div v-if="item.show">
              <router-link v-for="child of item.children" :key="child.to" :to="child.to">
                <mwc-list-item graphic="icon">
                  <slot>{{ child.name }}</slot><mwc-icon slot="graphic">{{ child.icon }}</mwc-icon>
                </mwc-list-item>
              </router-link>
            </div>
          </div>
          <!-- <mwc-list-item v-for="n of 20" :key="n">Item {{ n }}</mwc-list-item> -->
        </div>
        <mwc-list-item graphic="icon" @click="logout">
          <slot>Sign out</slot>
          <mwc-icon slot="graphic">exit_to_app</mwc-icon>
        </mwc-list-item>
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
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  // data () {
  //   return {
  //     menuItems: [
  //       { to: '/', name: 'Home', icon: 'home' },
  //       { show: false, name: 'Sites', icon0: 'keyboard_arrow_up', icon1: 'keyboard_arrow_down',
  //         children: [
  //           { to: '/site-a', name: 'Site A', icon: '' },
  //           { to: '/site-b', name: 'Vega Chart', icon: 'bar_chart' }
  //         ]
  //       }
  //     ]
  //   }
  // },
  // methods: {
  //   clickMe () {
  //     alert('Clicked')
  //   },
  // },

  setup(props, context) {
    const store = useStore()
    onMounted(async () => {
      console.log('mounted!')
      // addEventListener('load', () => {
      //   document.body.classList.remove('unresolved');
      // });

      const drawer = document.getElementsByTagName('mwc-drawer')[0];
      if (drawer) {
        const container = drawer.parentNode;
        container.addEventListener('MDCTopAppBar:nav', () => {
          drawer.open = !drawer.open;
        });
      }
    })
    
    const menuItems = ref([
      { to: '/', name: 'Home', icon: 'home' },
      { show: false, name: 'Sites', icon0: 'keyboard_arrow_up', icon1: 'keyboard_arrow_down',
        children: [
          { to: '/site-a', name: 'Site A', icon: '' },
          { to: '/site-b', name: 'Vega Chart', icon: 'bar_chart' }
        ]
      }
    ])
    const logout = () => {
      store.dispatch('doLogin', '')
    }

    return {
      menuItems, // ref,
      logout // method
    }
  }

}
</script>
