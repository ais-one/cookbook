<script>
  export default {
    name: 'formS',
    props: ['parentId', 'storeName', 'record'], // static
    data () {
      return {
        editSelectStatus: ['active', 'inactive'],
        selectActiveStatus: [v => !!v || 'Item is required']
      }
    }
  }
</script>

<template>
  <v-card-text>
    <v-text-field label="Name" v-model="record.info" required></v-text-field>
    <v-select label="Active" v-model="record.active" :items="editSelectStatus" :rules="selectActiveStatus" required></v-select>
  </v-card-text>
</template>
