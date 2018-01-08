<script>
  export default {
    name: 'subFilterS',
    props: ['parentId', 'storeName', 'filterData'], // static
    data () {
      return {
        filterSelectActive: [
          { text: 'active', value: true },
          { text: 'inactive', value: false }
        ],
        activeStatusRules: [v => !!v || 'Item is required']
      }
    }
  }
</script>

<template>
  <div>
    <v-select label="Active?" v-model="filterData.selectY" :items="filterSelectActive"
      item-value="value" item-text="text"
      return-object
      :rules="activeStatusRules" required
    ></v-select>
  </div>
</template>

