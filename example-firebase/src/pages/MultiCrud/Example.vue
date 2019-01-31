<template>
  <div id="not-needed">
    <v-layout row ref="pageTop" v-scroll="onScroll">
      <v-flex xs12>
        <h2>You can add various components, cruds, a chart, map, etc.</h2>
        <p>The clicking an item in left table will do a find() records in right table where Party Name matches Party. The right table also has the goBack() button to return to parent turned off</p>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <v-btn @click="showCustomTable=!showCustomTable" color="error">Toggle Slot: ({{ showCustomTable ?'User Defined':'Default'}})</v-btn>
        <vue-crud-x
          ref="my-table"
          storeName="multi-crud-party"
          :parentId="null"
          v-bind="partyDefs"
          @selected="onSelected"
        >
          <template v-if="showCustomTable" slot="filter" slot-scope="{ filterData, parentId, storeName }">
            <h1>Filter Slot: {{ storeName }} {{ !!parentId }}</h1>
            <div v-for="(filter, index) in filterData" :key="index">
              <component :is="filter.type" v-model="filter.value" v-bind="filter.attrs"></component>
            </div>
          </template>
          <template v-if="showCustomTable" slot="table" slot-scope="{ records, totalRecs, pagination }">
            <div v-for="record in records" :key="record.id"><p>{{ record.id }} {{ record.name }} <v-btn @click="$refs['my-table'].crudFormOpen(record.id)">Open</v-btn></p></div>
            <div>{{ totalRecs }} {{ pagination }}</div>
          </template>
          <template v-if="showCustomTable" slot="form" slot-scope="{ record, parentId, storeName }">
            <div>
              <h1>Form Slot: {{ storeName }} {{ !!parentId }}</h1>
              <v-card-text>
                <v-text-field label="Name" v-model="record.name"></v-text-field>
                <v-select label="Status" v-model="record.status" :items="status" :rules="ruleStatus" required></v-select>
                <v-text-field label="Remarks" v-model="record.remarks"></v-text-field>
                <v-select
                  label="Select"
                  :items="languages"
                  v-model="record.languages"
                  multiple
                  chips
                  hint="Languages Spoken"
                  persistent-hint
                ></v-select>
                <image-upload
                  v-if="record.id"
                  :storage-ref.sync="record.photo"
                  bucket="http://storage.googleapis.com/mybot-live.appspot.com"
                  :path="'mystore/'+record.id+'-'"
                  filename=""
                  collection="party"
                  :id="record.id"
                  field="photo"
                  :remove-old="true"
                />
                <v-text-field label="Created" v-model="record.created" readonly></v-text-field>
                <v-btn v-if="record.id" @click.stop.prevent="e => gotoNote(record.name)" dark>View My Notes</v-btn>
              </v-card-text>
            </div>
          </template>
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

import VueCrudX from '@/VueCrudX'
import ImageUpload from '@/components/ImageUpload'

export default {
  name: 'multi-crud-example',
  components: {
    VueCrudX,
    ImageUpload
  },
  data () {
    return {
      partyDefs,
      partyNotesDefs,
      selectedId: null,
      offsetTop: 0,
      showCustomTable: false,

      status: ['active', 'inactive'],
      ruleStatus: [v => !!v || 'Item is required'],
      languages: ['English', 'Bahasa', 'Chinese', 'Japanese', 'Thai']
    }
  },
  methods: {
    gotoNote (id) {
      // usually use this.record.id
      // for this example use this.record.name (please ensure name must be unique)
      this.$router.push({ path: '/party-notes/' + id })
    },
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
