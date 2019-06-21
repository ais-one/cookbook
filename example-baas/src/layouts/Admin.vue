<template>
  <v-app>
    <v-navigation-drawer v-if="userIsAuthenticated" app clipped v-model="drawer" fixed>
      <v-list dense>
        <template v-for="(item, i) in menuItems">
          <v-list-item :to="item.link" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dark app fixed clipped-left dense class="primary">
      <v-app-bar-nav-icon v-if="userIsAuthenticated" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>VueCrudX {{ currentTime }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="setLocale">{{ selectedLocale }}</v-btn>
      <v-btn icon @click="onLogout"><v-icon>exit_to_app</v-icon></v-btn>
    </v-app-bar>
    <main>
      <v-content>
        <v-container fluid class="pa-2">
          <router-view :key="$route.fullPath" dark></router-view>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      selectedLocale: 'EN',
      locales: [
        'EN', 'ID'
      ],
      drawer: false,
      menuItems: [
        { icon: 'dashboard', title: 'Multi CRUD', link: '/multi-crud-example' },
        { icon: 'schedule', title: 'Realtime', link: '/realtime-example' },
        { icon: 'home', title: 'CRUD Party', link: '/party' },
        { icon: 'create', title: 'CRUD Party Inline', link: '/party-inline' },
        { icon: 'dashboard', title: 'Test', link: '/test' }
      ]
    }
  },
  created () {
    if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
  },
  watch: {
    '$route' (to, from) {
    }
  },
  computed: {
    userIsAuthenticated () {
      // this.$store.getters.user !== null && this.$store.getters.user !== undefined
      return !!this.$store.getters.user
    }
  },
  methods: {
    setLocale () {
      this.selectedLocale = this.selectedLocale === 'EN' ? 'ID' : 'EN'
      if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
    },
    onLogout () {
      this.$store.dispatch('logout', { userLogout: true })
    }
  }
}
</script>
