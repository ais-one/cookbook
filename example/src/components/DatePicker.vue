<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="40"
    :return-value.sync="date"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="computedDateFormatted"
      :label="label"
      prepend-icon="event"
      readonly
    ></v-text-field>
    <v-date-picker v-model="date" no-title scrollable @input="changeDate"></v-date-picker>
  </v-menu>
</template>

<script>
// import {format} from 'date-fns'

export default {
  data: () => ({
    date: null,
    menu: false,
    modal: false
  }),
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Date'
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },
  created () {
    // console.log(this.date, this.value)
    this.date = this.value // format(this.value, 'YYYY-MM-DD')
  },
  methods: {
    changeDate () {
      this.$refs.menu.save(this.date)
      this.$emit('input', this.date)
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    }
  }
}
</script>
