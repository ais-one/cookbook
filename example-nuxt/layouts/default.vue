<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" fixed app>
      <v-list>
        <v-list-tile
          v-for="(item, i) in items" :to="item.to" :key="i" router exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title"/>
      <template v-if="$auth.$state.loggedIn">
        <v-btn @click.stop="$auth.logout()">
          {{ $auth.user.name }}
        </v-btn>
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
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { icon: 'apps', title: 'Home', to: '/' },
        { icon: 'bubble_chart', title: 'Public', to: '/public' },
        { icon: 'bubble_chart', title: 'Secure', to: '/secure' }
      ],
      miniVariant: false,
      title: 'Vuetify.js'
    }
  }
}
// this.$auth.user
</script>
