<template>
  <v-app>
    <v-toolbar class="success" dark app fixed clipped-left dense>
      <v-toolbar-title>Admin Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/signin">Sign In</v-btn>
        <v-btn flat to="/signup">Sign Up</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
  </v-app>
</template>
