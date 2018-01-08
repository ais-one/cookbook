<template>
  <v-app>
     <v-navigation-drawer v-if="userIsAuthenticated" app clipped v-model="drawer" fixed>
      <v-list dense>
        <template v-for="(item, i) in menuItems">
          <v-list-group :key="i" v-if="item.children" v-model="item.model" no-action>
            <v-list-tile slot="item" @click="">
              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :to="child.link" :key="i">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ child.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile :key="i" v-else :to="item.link">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="success" dark app fixed clipped-left dense>
      <v-toolbar-title>
        <v-toolbar-side-icon v-if="userIsAuthenticated" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        Crud Test
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <v-toolbar-items v-if="userIsAuthenticated">
          <v-btn flat>
            <v-avatar size="36px">
              <img src="./assets/john_leider.jpg" alt="John">
            </v-avatar> Somebody
          </v-btn>
          <v-btn flat @click="onLogout">
            <v-icon left dark>exit_to_app</v-icon>Exit
          </v-btn>
        </v-toolbar-items>
        <div v-if="userIsAuthenticated && false">
          <v-btn icon>
            <v-icon>apps</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>notifications</v-icon>
          </v-btn>
        </div>
        <v-menu :nudge-width="100" v-if="userIsAuthenticated && false">
          <v-toolbar-title slot="activator">
            <span>All</span>
            <v-icon dark>arrow_drop_down</v-icon>
          </v-toolbar-title>
          <v-list>
            <v-list-tile v-for="xxx in itemx" :key="xxx" @click="">
              <v-list-tile-title v-text="xxx"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-toolbar>
    <main>      
      <v-content>
        <v-container fluid>
          <router-view :key="$route.fullPath"></router-view>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      itemx: [
        'All', 'Family', 'Friends', 'Coworkers'
      ],
      menuItems: [
        { icon: 'settings', title: 'Do Nothing' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          title: 'Crud',
          model: true,
          children: [
            { icon: 'home', title: 'Notes', link: '/notes' },
            { icon: 'announcement', title: 'Notes2', link: '/notes2' }
          ]
        }
      ]
    }
  },
  computed: {
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
      window.location.replace('/')
    }
  }
}
</script>

<style lang="stylus">
  @require './stylus/main'
</style>
