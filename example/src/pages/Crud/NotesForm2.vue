<script>
export default {
  name: 'formZ2',
  props: ['parentId', 'storeName', 'record'], // static
  data () {
    return {
      editSelectStatus: [],
      selectApproveStatus: [v => !!v || 'Item is required']
    }
  },
  created () {
    this.editSelectStatus = [
      { text: 'Pending', value: 'pending' },
      { text: 'Review', value: 'review' },
      { text: 'Approved', value: 'approved' },
      { text: 'Rejected', value: 'rejected' }
    ]
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
          :rules="selectApproveStatus" required
        ></v-select>
      </v-card-text>
    </div>
    <div v-if="!record.id">
      <v-card-text>
        <v-text-field label="Party" v-model="record.party" required></v-text-field>
        <v-text-field label="Type" v-model="record.type" required></v-text-field>
        <v-text-field label="Value" v-model="record.value" required></v-text-field>
      </v-card-text>
    </div>
  </div>
</template>
