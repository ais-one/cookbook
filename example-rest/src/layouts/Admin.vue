<template>
  <v-app>
    <v-navigation-drawer v-if="userIsAuthenticated" app clipped v-model="drawer" fixed>
      <v-list dense>
        <template v-for="(item, i) in menuItems">
          <v-list-group
            :key="i"
            v-if="item.children"
            v-model="item.model"
            no-action
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.link"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :to="item.link" :key="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark app fixed clipped-left dense class="primary">
      <v-toolbar-title>
        <v-toolbar-side-icon v-if="userIsAuthenticated" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <div class="text-xs-center">
        <v-img src="/static/email.png" contain height="40" width="40" class="ma-2" />
      </div>
      {{ currentTime }}
      <v-spacer>
      </v-spacer>
      <v-toolbar-items v-if="userIsAuthenticated">
        <!-- <v-btn flat @click="onLogout"><v-icon left dark>exit_to_app</v-icon> Logout</v-btn> -->
        <!-- <v-img src="/static/email.png" contain height="40" width="172" class="mt-2" /> -->
      </v-toolbar-items>
      <div v-if="userIsAuthenticated">
        <v-menu bottom left offset-y>
          <v-btn slot="activator" icon>
            <v-icon>person</v-icon>
          </v-btn>
          <v-card>
            <v-list light>
              <v-list-tile @click="onLogout"><v-list-tile-title><v-icon left>exit_to_app</v-icon> Logout</v-list-tile-title></v-list-tile>
              <v-list-tile @click="tbd"><v-list-tile-title><v-icon left>settings</v-icon> User Settings</v-list-tile-title></v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-toolbar>

    <main>
      <v-content>
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
      </v-content>
    </main>
  </v-app>
</template>

<script>
import { format } from 'date-fns'
export default {
  data () {
    return {
      currentTime: format(Date(), 'HH:mm:ss'),
      selectedLocale: 'EN',
      locales: [
        'EN', 'ID'
      ],
      drawer: false,
      menuItems: [
        // {
        //   icon: 'keyboard_arrow_up',
        //   'icon-alt': 'keyboard_arrow_down',
        //   title: 'Menu',
        //   model: true,
        //   children: [
        //     { icon: 'dashboard', title: 'Dashboard', link: '/dashboard' },
        //   ]
        // },
        { icon: 'dashboard', title: 'Dashboard', link: '/dashboard' },
        { icon: 'list_alt', title: 'Authors', link: '/authors' },
        { icon: 'list_alt', title: 'Categories', link: '/categories' },
        { icon: 'list_alt', title: 'Books', link: '/books' }
      ]
    }
  },
  created () {
    if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
    this.timerId = setInterval(() => {
      this.currentTime = format(Date(), 'HH:mm:ss')
    }, 1000)
  },
  destroy () {
    clearInterval(this.timerId)
  },
  computed: {
    userIsAuthenticated () {
      // this.$store.getters.user !== null && this.$store.getters.user !== undefined
      return !!this.$store.getters.user
    },
    loading () { return this.$store.getters.loading },
    networkError () { return this.$store.getters.networkError }
  },
  methods: {
    setLocale (locale) {
      this.selectedLocale = locale
      if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
    },
    onLogout () {
      this.$store.dispatch('logout', { user: this.$store.getters.user })
    },
    tbd () {
      alert('Work In Progress')
    }
  }
}
</script>
