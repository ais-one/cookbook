<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" fixed app>
      <v-list>
        <template v-for="(item, i) in items">
          <v-list-tile :to="item.to" :key="i" v-if="!item.auth || $auth.$state.loggedIn" router exact>
            <v-list-tile-action>
              <v-icon v-html="item.icon" />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title" />
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <template v-if="$auth.$state.loggedIn">
        <v-btn @click.stop="$auth.logout()">Logout [{{ $auth.user }}]</v-btn>
      </template>
      <template v-else>
        <v-btn color="primary" flat nuxt to="/login">Login</v-btn>
      </template>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; None</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Home', to: '/' },
        { icon: 'bubble_chart', title: 'Dynamic Routes', to: '/dynamic/a' },
        { icon: 'bubble_chart', title: 'Public', to: '/public' },
        { icon: 'bubble_chart', title: 'Secure', to: '/secure' },
        { icon: 'bubble_chart', title: 'Authors', to: '/authors', auth: true },
        { icon: 'bubble_chart', title: 'Categories', to: '/categories', auth: true },
        { icon: 'bubble_chart', title: 'Books', to: '/books', auth: true },
        { icon: 'bubble_chart', title: 'Not Found', to: '/notfound' }
      ],
      miniVariant: false,
      title: 'Vuetify.js'
    }
  }
}
// this.$auth.user
</script>
