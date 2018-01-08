<script>
  export default {
    name: 'formS',
    props: ['parentId', 'storeName', 'record'], // static
    data () {
      return {
        editSelectStatus: [
          { text: 'Active', value: true },
          { text: 'Inactive', value: false }
        ],
        selectActiveStatus: [v => !!v || 'Item is required']
      }
    }
  }
</script>

<template>
  <div>
    <div v-if="record.id">
      <v-card-text>
        <v-text-field label="Name" v-model="record.info" required></v-text-field>
        <v-select label="Active" v-model="record.active" :items="editSelectStatus"
          item-value="value" item-text="text" return-object
          :rules="selectActiveStatus" required
        ></v-select>
      </v-card-text>
    </div>
    <div v-if="!record.id">
      <v-card-text>
        <v-text-field label="Name" v-model="record.info" required></v-text-field>
        <v-select label="Active" v-model="record.active" :items="editSelectStatus"
          item-value="value" item-text="text" return-object
          :rules="selectActiveStatus" required
        ></v-select>
      </v-card-text>
    </div>
  </div>
</template>
