<template>
  <mwc-drawer hasHeader type="modal">
    <span slot="title" class="h-center"><img class="text-center" src="http://via.placeholder.com/150x50" alt="My Dashboard"></span>
    <span slot="subtitle" class="h-center"><p>v0.0.1</p></span>
    <div class="drawer-content">
      <mwc-list>
        <router-link v-for="item of menuItems" :key="item.to" :to="item.to">
          <mwc-list-item graphic="icon">
            <slot>{{ item.name }}</slot><mwc-icon slot="graphic">{{ item.icon }}</mwc-icon>
          </mwc-list-item>
        </router-link>
        <mwc-list-item graphic="icon">
          <slot>Sign out</slot>
          <mwc-icon slot="graphic">exit_to_app</mwc-icon>
        </mwc-list-item>
        <!-- <mwc-list-item v-for="n of 20" :key="n">Item {{ n }}</mwc-list-item> -->
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
export default {
  data () {
    return {
      menuItems: [
        { to: '/', name: 'Home', icon: 'home' },
        { to: '/site-a', name: 'Site A', icon: '' },
        { to: '/site-b', name: 'Vega Chart', icon: 'bar_chart' }
      ]
    }
  },
  methods: {
    clickMe () {
      alert('Clicked')
    }
  },
  mounted () {
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
  }
}
</script>
