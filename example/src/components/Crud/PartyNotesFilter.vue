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
  },
  methods: {
    setStartDate (date) {
      this.filterData.dateStart = date
      this.$refs.refStartDate.save(this.filterData.dateStart)
    },
    setEndDate (date) {
      this.filterData.dateEnd = date
      this.$refs.refEndDate.save(this.filterData.dateEnd)
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

    <v-menu
      ref="refStartDate"
      lazy
      :close-on-content-click="true"
      v-model="menuDateStart"
      transition="scale-transition"
      offset-y
      full-width
      :nudge-right="40"
      max-width="290px"
      min-width="290px"
      :return-value.sync="filterData.dateStart"
    >
      <v-text-field slot="activator" label="Start Date" v-model="filterData.dateStart" prepend-icon="event" readonly :rules="startDateRules"></v-text-field>
      <v-date-picker v-model="filterData.dateStart" no-title scrollable @input="setStartDate">
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menuDateStart=false">Cancel</v-btn>
        <!-- v-btn flat color="primary" @click="$refs.refStartDate.save(filterData.dateStart)">OK</v-btn -->
      </v-date-picker>
    </v-menu>

    <v-menu
      ref="refEndDate"
      lazy
      :close-on-content-click="true"
      v-model="menuDateEnd"
      transition="scale-transition"
      offset-y
      full-width
      :nudge-right="40"
      max-width="290px"
      min-width="290px"
      :return-value.sync="filterData.dateEnd"
    >
      <v-text-field slot="activator" label="End Date" v-model="filterData.dateEnd" prepend-icon="event" readonly :rules="endDateRules"></v-text-field>
      <v-date-picker v-model="filterData.dateEnd" no-title scrollable @input="setEndDate">
        <v-spacer></v-spacer>
        <v-btn flat color="primary" @click="menuDateEnd=false">Cancel</v-btn>
        <!-- v-btn flat color="primary" @click="$refs.refEndDate.save(filterData.dateEnd)">OK</v-btn -->
      </v-date-picker>
    </v-menu>
  </div>
</template>
