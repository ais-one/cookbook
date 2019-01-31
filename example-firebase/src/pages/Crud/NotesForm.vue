<script>
import { firestore } from '@/firebase'

export default {
  name: 'notes-form',
  props: ['parentId', 'storeName', 'record'], // static
  data () {
    return {
      partyList: [],
      editSelectStatus: [
        { text: 'Pending', value: 'pending' },
        { text: 'Review', value: 'review' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' }
      ],
      ruleFilled: [v => !!v || 'Item is required']
    }
  },
  async created () {
    try {
      const rv = await firestore.collection('party').get() // populate select
      rv.forEach(record => {
        let data = record.data()
        this.partyList.push(data.name)
      })
    } catch (e) { }
  },
  methods: {
    goSubNote () {
      this.$router.push({ path: '/notesS/' + this.record.id })
    }
  }
}
</script>

<template>
  <div>
    <div v-if="record.id">
      <v-card-text>
        <v-text-field label="Approver (Read-only)" v-model="record.approver" readonly></v-text-field>
        <v-select label="Approve Status" v-model="record.approveStatus" :items="editSelectStatus"
          item-value="value" item-text="text" return-object
          :rules="ruleFilled" required
        ></v-select>
        <v-text-field label="Value" v-model="record.value" required :rules="ruleFilled"></v-text-field>
        <v-select label="Party" v-model="record.party" :items="partyList" :rules="ruleFilled" required></v-select>
        <v-btn @click.stop.prevent="goSubNote" dark>Modify SubNotes</v-btn>
      </v-card-text>
    </div>
    <div v-if="!record.id">
      <v-card-text>
        <v-select label="Party" v-model="record.party" :items="partyList" :rules="ruleFilled" required></v-select>
        <!-- v-text-field label="Party" v-model="record.party" required></v-text-field -->
        <v-text-field label="Type" v-model="record.type" required></v-text-field>
        <v-text-field label="Value" v-model="record.value" required :rules="ruleFilled"></v-text-field>
      </v-card-text>
    </div>
  </div>
</template>
