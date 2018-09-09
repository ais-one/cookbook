<script>
export default {
  name: 'user-form',
  props: ['parentId', 'storeName', 'record'], // static
  data () {
    return {
      isRequired: [v => !!v || 'Item is required']
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-text-field label="Email" v-model="record.email" :rules="isRequired" required></v-text-field>
      <v-text-field label="Password" v-model="record.hash" :rules="isRequired" required type="password"></v-text-field>
    </v-card-text>
  </v-card>
</template>
