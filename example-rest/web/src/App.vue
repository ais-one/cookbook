<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import LayoutAdmin from './layouts/Admin'
import LayoutDefault from './layouts/Default'

export default {
  components: {
    'layout-admin': LayoutAdmin,
    'layout-default': LayoutDefault
  },
  computed: {
    layout () {
      return this.$store.getters.layout
    }
  }
}
</script>

<style lang="stylus">
  @require './stylus/main'
</style>
