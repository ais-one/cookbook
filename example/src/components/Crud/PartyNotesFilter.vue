<script>
import {differenceInCalendarDays} from 'date-fns'
export default {
  name: 'notes-filter',
  props: ['parentId', 'storeName', 'filterData'], // static
  data () {
    return {
      menuDateStart: false,
      menuDateEnd: false,
      filterSelectStatus: [
        { text: 'All', value: 'all' },
        { text: 'Pending', value: 'pending' },
        { text: 'Review', value: 'review' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' }
      ],
      name: '',
      nameRules: [
        (v) => !!v || 'Item is required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      startDateRules: [
        (v) => (v <= this.filterData.dateEnd) || 'Start date must be earlier or same as end date',
        (v) => (differenceInCalendarDays(this.filterData.dateEnd, v) <= 60) || 'Select only up to 60 days of records at a time'
      ],
      endDateRules: [
        (v) => (v >= this.filterData.dateStart) || 'End date must be later or same as start date',
        (v) => (differenceInCalendarDays(v, this.filterData.dateStart) <= 60) || 'Select only up to 60 days of records at a time'
      ],
      approveStatusRules: [v => !!v || 'Item is required']
    }
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
    <v-text-field v-model="filterData.dateStart" type="date" label="Start Date" :rules="startDateRules"></v-text-field>
    <v-text-field v-model="filterData.dateEnd" type="date" label="End Date" :rules="endDateRules"></v-text-field>
  </div>
</template>
