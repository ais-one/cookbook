<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="40"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        v-model="computedDateFormatted"
        :label="label"
        :prepend-icon="iconName"
        readonly
        :hint="hint"
        :persistent-hint="persistentHint"
      ></v-text-field>
    </template>
    <v-date-picker v-if="menu" v-model="date" no-title scrollable @input="changeDate">
      <v-btn style="margin: auto" text color="primary" @click="menu=false">Cancel</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
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
    hint: {
      type: String,
      default: ''
    },
    'persistent-hint': {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: '' // event
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    }
  },
  created () {
    if (this.value) {
      this.date = this.value // format(this.value, 'yyyy-MM-dd')
    } else {
      this.date = (new Date()).toISOString().substring(0, 10) // 'yyyy-MM-dd'
    }
  },
  methods: {
    changeDate () {
      this.$refs.menu.save(this.date)
      this.$emit('input', this.date)
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return (new Date(year, month - 1, day)).toISOString().substring(0, 10) // format(new Date(year, month - 1, day), this.format) // `${day}-${month}-${year}`
    }
  }
}
</script>
