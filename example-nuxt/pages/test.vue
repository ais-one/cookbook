<template>
  <div>
    <v-layout row wrap>
      <v-flex v-if="loggedIn" xs12>
        <vue-crud-x crudTitle="Test1" storeName="test1" :parentId="null" v-bind="defs" />
      </v-flex>
      <v-flex v-else xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" label="Mail" id="email" v-model="email" type="email" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn type="submit" :disabled="loading" :loading="loading">
                      Sign in
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import {auth} from '@/components/firebase'
import VueCrudX from '@/components/VueCrudX' // copy the source vue file here if you want to tinker with it
import * as partyInlineDefs from '@/components/party-inline'

export default {
  name: 'party-component-example',
  components: {
    VueCrudX
  },
  data () {
    return {
      loading: false,
      email: '',
      password: '',
      loggedIn: false,
      defs: partyInlineDefs
    }
  },
  created () {
    console.log('created', this.$store)
  },
  methods: {
    async onSignin () {
      let user = null
      this.loading = true
      try {
        user = await auth.signInWithEmailAndPassword(this.email, this.password)
      } catch (e) { }
      this.loading = false
      if (!user) alert('Login error')
      else this.loggedIn = true
    }
  }
}
</script>
