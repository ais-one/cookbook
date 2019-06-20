<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="40"
    :return-value.sync="time"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="time"
      :label="label"
      :prepend-icon="iconName"
      readonly
    ></v-text-field>
    <v-time-picker v-if="menu" v-model="time" format="24hr" no-title scrollable @change="changeTime"></v-time-picker>
  </v-menu>
</template>

<script>
// import {format} from 'date-fns'

export default {
  data: () => ({
    time: null,
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
      default: 'Time'
    },
    iconName: {
      type: String,
      default: 'access_time'
    }
  },
  created () {
    this.time = this.value // format(this.value, 'YYYY-MM-DD')
  },
  methods: {
    changeTime () {
      // console.log(this.time)
      this.$refs.menu.save(this.time)
      // this.$emit('input', this.time)
    }
  }
}
</script>
