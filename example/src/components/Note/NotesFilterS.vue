<script>
  export default {
    name: 'subFilterS',
    props: ['parentId', 'storeName', 'filterData'], // static
    data () {
      return {
        filterSelectActive: [ 'active', 'inactive' ],
        activeStatusRules: [v => !!v || 'Item is required']
      }
    }
  }
</script>

<template>
  <div>
    <v-select label="Active Status" v-model="filterData.selectActive" :items="filterSelectActive" :rules="activeStatusRules" required
    ></v-select>
  </div>
</template>

