<template>
  <div>
    <v-layout row wrap class="py-2">
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-toolbar dense dark class="secondary">
            <v-toolbar-title>Vue Crud X</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container fluid>
              <v-layout row wrap>
                <v-flex xs12>
                  <h2 class="py-2 text-xs-center">Test Your Other Stuff Here</h2>
                  <p class="py-2 text-xs-center">Click on the top left menu icon to navigate</p>
                  <p class="py-2 text-xs-center">On this page, websocket messages are sent to server every 10 seconds (websocket must be enabled .env file). Message will appear server console.log</p>
                  <p class="py-2 text-xs-center">Message to server will be echoed back here... ({{ wsMsg }})</p>
                  <p class="py-2 text-xs-center">
                    <v-btn @click="testGraphQL">Test GraphQL</v-btn>
                  </p>
                  <p class="py-2 text-xs-center">GraphQL Query Result... ({{ hello }})</p>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
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
      hello: 'NA',
      wsMsg: 'No WS Message Yet'
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
        // console.log('onmessage', rv) // create listener
        const data = JSON.parse(rv.data)
        // console.log('onmessage', typeof JSON.parse(rv.data))
        this.wsMsg = data.args
      }
      // this.$store.getters.user.token
      this.priceTimerId = setInterval(async () => {
        this.$socket.sendObj({
          call: 'msg-from-client',
          args: 'Hello from client! ' + parseInt(Date.now() / 1000)
        })
        if (navigator.onLine) this.updateNetworkError(false)
        else this.updateNetworkError(true)
      }, 10000)
    }
  },
  methods: {
    async testGraphQL () {
      this.$apollo.queries.hello.skip = false
      await this.$apollo.queries.hello.refetch()
    },
    updateNetworkError (flag) {
      this.$store.dispatch('setNetworkError', flag)
    }
  }
}
</script>
