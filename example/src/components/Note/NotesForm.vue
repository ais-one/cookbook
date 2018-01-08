<script>
  export default {
    name: 'formZ',
    props: ['parentId', 'storeName', 'record'], // static
    data () {
      return {
        editSelectStatus: [
          { text: 'Pending', value: 'pending' },
          { text: 'Review', value: 'review' },
          { text: 'Approved', value: 'approved' },
          { text: 'Rejected', value: 'rejected' }
        ],
        selectApproveStatus: [v => !!v || 'Item is required']
      }
    },
    methods: {
      goSubNote () {
        this.$router.push({path: '/notesS/' + this.record.id})
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
          :rules="selectApproveStatus" required
        ></v-select>
        <v-btn @click.stop.prevent="goSubNote" dark>Modify SubNotes</v-btn>
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
