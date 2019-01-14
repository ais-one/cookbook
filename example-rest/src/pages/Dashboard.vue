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
                  <h2 class="py-2 text-xs-center">Alerts</h2>
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
export default {
  name: 'dashboard',
  components: {
  },
  data () {
    return {
    }
  },
  created () {
    this.priceTimerId = null
  },
  beforeDestroy () {
    delete this.$options.sockets.onmessage
    clearInterval(this.priceTimerId)
  },
  async mounted () {
    this.$options.sockets.onmessage = (rv) => {
      console.log('onmessage', rv) // create listener
    }
    /*
      data: "{"call":"updateBalances","args":[{"balance":"0.24980000","pair":"LTC"},{"balance":"None","pair":"BTC"},{"balance":"1.86032896","pair":"ETH"}]}"
      isTrusted: true
      origin: "ws://3.0.20.82:8442"
    */
    // try {
    //   const opts = { headers: { token: this.$store.getters.user.token } }
    //   const rv = await http.get('/abc', opts)
    // } catch (e) { }

    this.priceTimerId = setInterval(async () => {
      this.$socket.sendObj({
        call: 'aa',
        args: 'bbc'
      })
      if (navigator.onLine) this.updateNetworkError(false)
      else this.updateNetworkError(true)
    }, 10000)
  },
  methods: {
    updateNetworkError (flag) {
      this.$store.dispatch('setNetworkError', flag)
    }
  }
}
</script>
