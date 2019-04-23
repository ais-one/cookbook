<template>
  <div>
    <v-layout row wrap class="py-2">
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-toolbar dense dark class="secondary">
            <v-toolbar-title>TEST</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container fluid>
              <v-layout row wrap>
                <v-flex xs12>
                  <h2 class="py-2 text-xs-center">Test Your Other Stuff Here</h2>
                  <p class="py-2 text-xs-center">Click on the top left menu icon to navigate</p>
                  <p class="py-2 text-xs-center">If you are on this page, web socket messages are sent to the server every 10 seconds (if websocket is configured in .env file). On the server console.log, you can see the messages</p>
                  <p class="py-2 text-xs-center">
                    <v-btn @click="test">Test GraphQL</v-btn>
                  </p>
                </v-flex>
              </v-layout>
              <!-- There will be several rows -->
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import { http } from '@/axios'
import gql from 'graphql-tag'

export default {
  name: 'dashboard',
  components: {
  },
  apollo: {
    // Query with parameters
    hello: {
      // gql query
      query: gql`query DoHello($message: String!) {
        hello(message: $message)
      }`,
      // Static parameters
      variables: {
        message: 'Meow'
      }
      // skip() {
      //   return this.skipQuery
      // }
    }
  },
  data () {
    return {
      // skipQuery: true,
      hello: 'NA'
    }
  },
  created () {
    this.$apollo.queries.hello.skip = true
    this.priceTimerId = null
  },
  beforeDestroy () {
    if (this.$socket) {
      delete this.$options.sockets.onmessage
      clearInterval(this.priceTimerId)
    }
  },
  async mounted () {
    if (this.$socket) {
      this.$options.sockets.onmessage = (rv) => {
        console.log('onmessage', rv) // create listener
      }
      // this.$store.getters.user.token
      this.priceTimerId = setInterval(async () => {
        this.$socket.sendObj({
          call: 'msg-from-client',
          args: 'Hello from client!'
        })
        if (navigator.onLine) this.updateNetworkError(false)
        else this.updateNetworkError(true)
      }, 10000)
    }
  },
  methods: {
    async test () {
      this.$apollo.queries.hello.skip = false
      await this.$apollo.queries.hello.refetch()
      alert('Test2 ' + this.hello)
    },
    updateNetworkError (flag) {
      this.$store.dispatch('setNetworkError', flag)
    }
  }
}
</script>
