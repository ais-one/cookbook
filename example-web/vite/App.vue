<template>
  <mwc-drawer hasHeader type="modal">
    <span slot="title">Drawer Title</span>
    <span slot="subtitle">subtitle</span>
    <div class="drawer-content">
      <p>Drawer content</p>
      <mwc-icon-button icon="gesture"></mwc-icon-button>
      <mwc-icon-button icon="gavel" id="gavel"></mwc-icon-button>
    </div>
    <div slot="appContent">
      <mwc-top-app-bar-fixed>
        <mwc-icon-button slot="navigationIcon" icon="menu"></mwc-icon-button>
        <div slot="title">Title</div>
        <mwc-icon-button slot="actionItems" icon="cast"></mwc-icon-button>
        <mwc-icon-button slot="actionItems" icon="fingerprint"></mwc-icon-button>
      </mwc-top-app-bar-fixed>
      <div class="main-content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  </mwc-drawer>

    <!-- <div>
      <mwc-top-app-bar-fixed>
        <mwc-icon-button icon="menu" slot="navigationIcon"></mwc-icon-button>
        <div slot="title">Title</div>
        <mwc-icon-button icon="file_download" slot="actionItems" @click="clickMe"></mwc-icon-button>
        <mwc-icon-button icon="print" slot="actionItems"></mwc-icon-button>
        <mwc-icon-button icon="favorite" slot="actionItems"></mwc-icon-button>
      </mwc-top-app-bar-fixed>
      <div>
        <h1>A Test Application For Vite</h1>
        <router-view></router-view>
      </div>
    </div> -->
</template>

<script>
// :key="$route.fullPath" // this is causing problems
export default {
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
