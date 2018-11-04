<template>
  <div id="abc">
    <v-layout row ref="pageTop" v-scroll="onScroll">
      <v-flex xs12>
        <h2>You can add various components, cruds, a chart, map, etc.</h2>
        <p>The clicking an item in left table will do a find() records in right table where Party Name matches Party. The right table also has the goBack() button to return to parent turned off</p>
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
    <v-btn v-if="offsetTop" fab fixed dark bottom right @click.stop="scrollToTop"><v-icon>arrow_upward</v-icon></v-btn>
  </div>
</template>

<script>
import * as partyDefs from './party'
import * as partyNotesDefs from './party-notes'
// import VueCrudX from '../../../../VueCrudX' // @/VueCrudX // copy the source vue file here if you want to tinker with it
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
      selectedId: null,
      offsetTop: 0
    }
  },
  methods: {
    scrollToTop () {
      this.$nextTick(function () {
        this.$refs.pageTop.scrollIntoView()
      })
    },
    onScroll (e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
    },
    async onSelected (data) {
      this.selectedId = data.item.name
      await this.$refs.testref.getRecordsHelper()
    }
  }
}
</script>
