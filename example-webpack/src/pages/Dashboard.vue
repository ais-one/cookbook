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
      testResult: 'NA'
    }
  },
  created () {
  },
  beforeDestroy () {
  },
  async mounted () {
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
    }
  }
}
</script>
