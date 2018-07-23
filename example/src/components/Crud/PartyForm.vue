<script>
import ImageUpload from '../ImageUpload'

export default {
  name: 'party-form',
  components: {
    ImageUpload
  },
  props: ['parentId', 'storeName', 'record'], // static
  data () {
    return {
      status: ['active', 'inactive'],
      ruleStatus: [v => !!v || 'Item is required'],
      languages: ['English', 'Bahasa', 'Chinese', 'Japanese', 'Thai']
    }
  },
  methods: {
    gotoNote () {
      // usually use this.record.id
      // for this example use this.record.name (please ensure name must be unique)
      this.$router.push({path: '/party-notes/' + this.record.name})
    }
  }
}
</script>

<template>
  <div>
    <v-card-text>
      <v-text-field label="Name" v-model="record.name"></v-text-field>
      <v-select label="Status" v-model="record.status" :items="status" :rules="ruleStatus" required></v-select>
      <v-text-field label="Name" v-model="record.remarks"></v-text-field>
      <v-select
        label="Select"
        :items="languages"
        v-model="record.languages"
        multiple
        chips
        hint="Languages Spoken"
        persistent-hint
      ></v-select>
      <image-upload v-if="record.id" ref="upload" :url.sync="record.photo" />
      <v-btn @click.stop.prevent="gotoNote" dark>View My Notes</v-btn>
    </v-card-text>
  </div>
</template>
