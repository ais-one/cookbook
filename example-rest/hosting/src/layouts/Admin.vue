<template>
  <v-app>
    <v-navigation-drawer v-if="userIsAuthenticated" app clipped v-model="drawer" fixed>
      <v-list dense>
        <template v-for="(item, i) in menuItems">
          <v-layout row
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>

          <v-list-group
            :key="i"
            v-else-if="item.children"
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
    <v-toolbar class="success" dark app fixed clipped-left dense>
      <v-toolbar-title>
        <v-toolbar-side-icon v-if="userIsAuthenticated" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        Admin Dashboard
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <v-toolbar-items v-if="userIsAuthenticated">
          <v-btn flat @click="onLogout"><v-icon left dark>exit_to_app</v-icon> Logout</v-btn>
        </v-toolbar-items>
        <div v-if="userIsAuthenticated && false">
          <v-btn icon>
            <v-icon>apps</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>notifications</v-icon>
          </v-btn>
        </div>
      </v-toolbar>
    <main>
      <v-content>
        <v-container fluid>
          <router-view :key="$route.fullPath"></router-view>
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
export default {
  data () {
    return {
      selectedLocale: 'EN',
      locales: [
        'EN', 'ID'
      ],
      drawer: false,
      menuItems: [
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          title: 'Crud',
          model: true,
          children: [
            { icon: 'list_alt', title: 'User', link: '/user' },
            { icon: 'list_alt', title: 'Resource', link: '/resource' }
          ]
        }
      ]
    }
  },
  created () {
    if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
  },
  computed: {
    userIsAuthenticated () {
      // this.$store.getters.user !== null && this.$store.getters.user !== undefined
      return !!this.$store.getters.user
    },
    loading () { return this.$store.getters.loading }
  },
  methods: {
    setLocale (locale) {
      this.selectedLocale = locale
      if (this.$i18n) this.$i18n.locale = this.selectedLocale.toLowerCase()
    },
    onLogout () {
      this.$store.dispatch('logout', {user: this.$store.getters.user})
    }
  }
}
</script>
