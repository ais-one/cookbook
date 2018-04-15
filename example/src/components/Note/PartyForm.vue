<script>
export default {
  name: 'party-form',
  props: ['parentId', 'storeName', 'record'], // static
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<template>
  <div>
    <v-card-text>
      <v-text-field label="Name" v-model="record.name"></v-text-field>
    </v-card-text>
  </div>
</template>
