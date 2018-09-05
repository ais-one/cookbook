<script>
import { firestore } from '@/firebase'

export default {
  name: 'muli-crud-party-notes-form',
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
    // console.log('party-notes created', this.parentId)
    try {
      const rv = await firestore.collection('party').get().limit(50) // populate select
      rv.forEach(record => {
        let data = record.data()
        this.partyList.push(data.name)
      })
    } catch (e) { }
  }
}
</script>

<template>
  <div>
    <h1>Custom Party Notes Form</h1>
    <div v-if="record.id">
      <v-card-text>
        <v-select label="Party" v-model="record.party" :items="partyList" :rules="ruleFilled" required></v-select>
        <v-text-field label="Approver (Read-only)" v-model="record.approver" readonly></v-text-field>
        <v-select label="Approve Status" v-model="record.approveStatus" :items="editSelectStatus"
          item-value="value" item-text="text" return-object
          :rules="ruleFilled" required
        ></v-select>
        <v-text-field label="Value" v-model="record.value" required :rules="ruleFilled"></v-text-field>
      </v-card-text>
    </div>
    <div v-if="!record.id">
      <v-card-text>
        <v-text-field label="Party" v-model="parentId" readonly></v-text-field>
        <v-text-field label="Type" v-model="record.type" required></v-text-field>
        <v-text-field label="Value" v-model="record.value" required :rules="ruleFilled"></v-text-field>
      </v-card-text>
    </div>
  </div>
</template>
