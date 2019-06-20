<template>
  <v-app>
    <v-toolbar class="success" dark app fixed clipped-left dense>
      <v-toolbar-title>Crud Test</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>
