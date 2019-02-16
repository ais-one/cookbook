<template>
  <v-app>
    <main>
      <v-content>
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
      loading: true
    }
  },
  computed: {
    // loading () { return this.$store.getters.loading }
  }
}
</script>
