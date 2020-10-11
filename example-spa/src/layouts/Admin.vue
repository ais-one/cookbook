<template>
  <v-app>
    <v-navigation-drawer v-if="userIsAuthenticated" app clipped v-model="drawer" fixed>
      <v-list dense>
        <template v-for="(item, i) in menuItems">
          <v-list-item v-if="showMenuItem(item.groups)" :to="item.link" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dark app fixed clipped-left dense class="primary">
      <v-app-bar-nav-icon v-if="userIsAuthenticated" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ currentTime }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="setLocale">{{ selectedLocale }}</v-btn>
      <v-btn icon @click="onLogout"><v-icon>exit_to_app</v-icon></v-btn>
    </v-app-bar>
    <main>
      <v-main>
        <v-container fluid>
          <router-view :key="$route.fullPath"></router-view>
          <v-footer class="pa-2" fixed app>
            <v-spacer></v-spacer>
            <v-icon :color="networkError?'#f00':'#0f0'">chat</v-icon>
            <div>&copy; {{ new Date().getFullYear() }}</div>
          </v-footer>
        </v-container>
        <v-layout row justify-center>
          <v-dialog v-model="loading" persistent fullscreen>
            <v-container fill-height>
              <v-layout row justify-center align-center>
                <v-progress-circular indeterminate :size="70" :width="7" color="black"></v-progress-circular>
              </v-layout>
            </v-container>
          </v-dialog>
        </v-layout>
      </v-main>
    </main>
  </v-app>
</template>

<script>
import permissions from '@/permissions'

export default {
  data () {
    return {
      currentTime: '',
      selectedLocale: 'EN',
      locales: [
        'EN', 'ID'
      ],
      drawer: false,
      menuItems: [
        { icon: 'dashboard', title: 'Dashboard', link: '/dashboard' },
        { icon: 'list_alt', title: 'Authors', link: '/authors' },
        { icon: 'list_alt', title: 'Categories', link: '/categories' },
        { icon: 'list_alt', title: 'Books', link: '/books' },
        { icon: 'list_alt', title: 'Test Stuff', link: '/test', groups: ['TestGroup'] }
      ]
    }
  },
  created () {
    if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
    this.timerId = setInterval(() => {
      this.currentTime = (new Date()).toISOString().substring(11, 19)
    }, 1000)
  },
  destroy () {
    clearInterval(this.timerId)
  },
  computed: {
    userIsAuthenticated () {
      // this.$store.state.user !== null && this.$store.state.user !== undefined
      return !!this.$store.state.user
    },
    user () {
      return this.$store.state.user
    },
    loading () { return this.$store.getters.loading },
    networkError () { return this.$store.state.networkError },
  },
  methods: {
    showMenuItem (groups) {
      if (!groups) return true
      return permissions.allowed(groups, this.user.groups.split(','))
    },
    setLocale () {
      this.selectedLocale = this.selectedLocale === 'EN' ? 'ID' : 'EN'
      if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
    },
    onLogout () {
      this.$store.dispatch('logout', { user: this.$store.state.user })
    }
  }
}
</script>
