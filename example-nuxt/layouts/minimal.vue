<template>
  <v-app dark>
    <v-toolbar fixed app>
      <v-toolbar-title v-text="title" />
      <template>
        <v-btn color="primary" nuxt to="/">Go Home</v-btn>
      </template>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'Minimal Layout'
    }
  }
}
</script>
