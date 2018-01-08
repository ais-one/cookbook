<script>
//  import moment from 'moment'
  export default {
    name: 'filterZ2',
    props: ['parentId', 'storeName', 'filterData'], // static
    data () {
      return {
//        menuDateStart: false,
//        menuDateEnd: false,
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
/*
        startDateRules: [
          (v) => (v <= this.filterData.dateEnd) || 'Start date must be earlier or same as end date',
          (v) => (moment(this.filterData.dateEnd, 'YYYY-MM-DD').diff(moment(v, 'YYYY-MM-DD'), 'days') <= 60) || 'Select only up to 60 days of records at a time'
        ],
        endDateRules: [
          (v) => (v >= this.filterData.dateStart) || 'End date must be later or same as start date',
          (v) => (moment(v, 'YYYY-MM-DD').diff(moment(this.filterData.dateStart, 'YYYY-MM-DD'), 'days') <= 60) || 'Select only up to 60 days of records at a time'
        ],
*/
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
<!--
    <v-menu lazy :close-on-content-click="false" v-model="menuDateStart"
      transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px"
    >
      <v-text-field slot="activator" label="Start Date" v-model="filterData.dateStart" prepend-icon="event" 
        readonly
        :rules="startDateRules"
      ></v-text-field>
      <v-date-picker v-model="filterData.dateStart" no-title scrollable actions autosave />
    </v-menu>
    <v-menu lazy :close-on-content-click="false" v-model="menuDateEnd"
      transition="scale-transition" offset-y full-width :nudge-right="40" max-width="290px" min-width="290px"
    >
      <v-text-field slot="activator" label="End Date" v-model="filterData.dateEnd" prepend-icon="event"
        readonly
        :rules="endDateRules"
      ></v-text-field>
      <v-date-picker v-model="filterData.dateEnd" no-title scrollable actions autosave />
    </v-menu>
-->
  </div>
</template>

