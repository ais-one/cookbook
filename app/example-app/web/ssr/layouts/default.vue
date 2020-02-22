<template>
  <div class="container">
    <div>
      <div>
        <template v-for="(item, i) in items">
          <nuxt-link class="h-space" :to="item.to" :key="i" v-if="!item.auth || $store.state.user" router exact>{{ item.title }}</nuxt-link>
        </template>
        <button v-if="$store.state.user" @click.stop="doLogout">Logout [{{ $store.state.user.id }}]</button>
        <nuxt-link v-else to="/login">Login</nuxt-link>
      </div>
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
      items: [
        { icon: 'apps', title: 'Home', to: '/' },
        { icon: 'bubble_chart', title: 'Dynamic Routes', to: '/dynamic/1' },
        { icon: 'bubble_chart', title: 'Public', to: '/public' },
        { icon: 'bubble_chart', title: 'Secure', to: '/secure' },
        { icon: 'bubble_chart', title: 'Authors', to: '/authors', auth: true },
        { icon: 'bubble_chart', title: 'Categories', to: '/categories', auth: true },
        { icon: 'bubble_chart', title: 'Books', to: '/books', auth: true },
        { icon: 'bubble_chart', title: 'Not Found', to: '/notfound' }
      ]
    }
  },
  methods: {
    doLogout () {
      this.$store.dispatch('logout', { user: this.$store.state.user })
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.h-space {
  padding-right: 8px;
}
</style>
