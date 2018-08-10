<template>
  <v-div>
    <v-layout row>
      <v-flex xs12>
        <h1>You can also add a chart, map or some other component on the right, something components below, etc.</h1>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <vue-crud-x crudTitle="Test1" storeName="test1" :parentId="null" v-bind="defs" />
      </v-flex>
      <v-flex xs12 sm6>
        <v-container>
          <v-card>
            <v-card-media
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
              height="200px"
            ></v-card-media>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn flat color="orange">Share</v-btn>
              <v-btn flat color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-div>
</template>

<script>
import VueCrudX from '@/VueCrudX' // copy the source vue file here if you want to tinker with it
import * as partyInlineDefs from '@/components/Crud/party-inline'

export default {
  name: 'party-component-example',
  components: {
    VueCrudX
  },
  data () {
    return {
      defs: partyInlineDefs
    }
  },
  methods: {
  }
}
</script>
