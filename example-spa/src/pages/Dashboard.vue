<template>
  <div>
    <v-layout row wrap class="pa-2">
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-card-text>
            <v-container fluid>
              <v-layout row wrap>
                <v-flex xs12>
                  <h2 class="py-1 text-center">Test Your Other Stuff Here</h2>
                  <p class="py-1 text-center">Click on the top left menu icon to navigate</p>
                  <p class="py-1 text-center">On this page, websocket messages are sent to server every 10 seconds (websocket must be enabled .env file). Message will appear server console.log</p>
                  <p class="py-1 text-center">Message to server will be echoed back here... ({{ wsMsg }})</p>
                  <p class="py-1 text-center">
                    <v-btn @click="testGraphQL">Test GraphQL</v-btn>
                    <v-btn @click="testAuth">Test Auth</v-btn>
                    <v-btn @click="testApi">Test API</v-btn>
                    <v-btn @click="testHealth">Test Health</v-btn>
                    <v-btn @click="testHealthAuth">Test Health Auth</v-btn>
                  </p>
                  <p class="py-1 text-center">GraphQL Query Result... ({{ hello }})</p>
                  <p class="py-1 text-center">Other Test Results (also see console logs)... ({{ testResult }})</p>
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
import { http } from '@/axios'
import { apolloClient } from '@/graphql'

export default {
  name: 'dashboard',
  components: {
  },
  data () {
    return {
      hello: 'NA',
      wsMsg: 'No WS Message Yet',
      testResult: 'NA'
    }
  },
  created () {
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
      // this.$store.state.user.token
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
    async testHealth () {
      try {
        const rv = await http.get('/api/healthcheck')
        console.log(rv.data)
        this.testResult = JSON.stringify(rv.data)
      } catch (e) {
        console.log(e.toString())
        this.testResult = e.toString()
      }
    },
    async testHealthAuth () {
      try {
        const rv = await http.get('/api/health-auth')
        console.log(rv.data)
        this.testResult = JSON.stringify(rv.data)
      } catch (e) {
        console.log(e.toString())
        this.testResult = e.toString()
      }
    },
    async testAuth () {
      try {
        const rv = await http.get('/api/auth/me')
        console.log(rv.data)
        this.testResult = JSON.stringify(rv.data)
      } catch (e) {
        console.log(e.toString())
        this.testResult = e.toString()
      }
    },
    async testApi () {
      try {
        const { data } = await http.get(`/api/authors/1`)
        console.log(data)
        this.testResult = JSON.stringify(data)
      } catch (e) {
        console.log(e.toString())
        this.testResult = e.toString()
      }
    },
    async testGraphQL () {
      const rv = await apolloClient.query({ query: gql`query DoHello($message: String!) { hello(message: $message) }`, variables: { message: 'Meow' } })
      console.log('testGraphQL', rv.data.hello)
      this.hello = rv.data.hello
    },
    updateNetworkError (flag) {
      this.$store.dispatch('setNetworkError', flag)
    }
  }
}
</script>
