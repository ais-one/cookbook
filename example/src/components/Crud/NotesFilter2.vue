<script>
export default {
  name: 'filterZ2',
  props: ['parentId', 'storeName', 'filterData'], // static
  data () {
    return {
      filterSelectStatus: [],
      name: '',
      nameRules: [
        (v) => !!v || 'Item is required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      approveStatusRules: [v => !!v || 'Item is required']
    }
  },
  created () {
    this.filterSelectStatus = [
      { text: 'All', value: 'all' },
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
    <v-text-field  v-show="false" label="Name" v-model="name" :rules="nameRules" :counter="10" required></v-text-field>
    <v-select label="Approve Status" v-model="filterData.selectX" :items="filterSelectStatus"
      item-value="value" item-text="text"
      return-object
      :rules="approveStatusRules" required
    ></v-select>
  </div>
</template>
