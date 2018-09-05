<template>
  <div>
    <v-layout row>
      <v-flex xs12>
        <h2>You can add various components, cruds, a chart, map, etc.</h2>
        <p>The clicking an item in left table will do a find() records in right table where Party Name matches Party. The right table also has the goBack() button to return to parent turned off</p>
        <p>Currently there is an issue for multi crud page. Only autugenerated filters and forms work. If you use use custom, what is seen is that the only 1 custom component is created. You can change FilterVue().component from null to import('./Filter.vue') to see the effect when you open the filters</p>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <vue-crud-x
          storeName="multi-crud-party"
          :parentId="null"
          v-bind="partyDefs"
          @selected="onSelected"
        >
        </vue-crud-x>
      </v-flex>
      <v-flex xs12 sm6>
        <vue-crud-x
          ref="testref"
          storeName="multi-crud-party-notes"
          :parentId="selectedId"
          v-bind="partyNotesDefs"
        >
        </vue-crud-x>
      </v-flex>
      <v-flex xs12 sm6>
        <v-container>
          <v-card>
            <v-img
              src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
              height="200px"
            ></v-img>
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
  </div>
</template>

<script>
import * as partyDefs from './party'
import * as partyNotesDefs from './party-notes'
import VueCrudX from '@/VueCrudX' // copy the source vue file here if you want to tinker with it

export default {
  name: 'multi-crud-page-example',
  components: {
    VueCrudX
  },
  data () {
    return {
      partyDefs,
      partyNotesDefs,
      selectedId: null
    }
  },
  created () {

  },
  methods: {
    async onSelected (data) {
      this.selectedId = data.item.name
      await this.$refs.testref.getRecordsHelper()
    }
  }
}
</script>
