<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="40"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-on="on"
        v-model="computedTimeFormatted"
        :label="label"
        :prepend-icon="iconName"
        readonly
        :hint="hint"
        :persistent-hint="persistentHint"
      ></v-text-field>
    </template>
    <v-time-picker v-if="menu" v-model="time" format="24hr" no-title scrollable @change="changeTime" :allowed-minutes="allowedMinutes" >
      <v-btn style="margin: auto" text color="primary" @click="menu=false">Cancel</v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    time: null,
    menu: false,
    modal: false
  }),
  props: {
    allowedMinutes: {
      type: Array,
      default: null
    },
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
      default: '' // access_time
    },
    format: {
      type: String,
      default: 'HH:mm'
    }
  },
  computed: {
    computedTimeFormatted () {
      return this.formatTime(this.time)
    }
  },
  created () {
    if (this.value) {
      this.time = this.value // format(this.value, 'HH:mm')
    } else {
      this.time = (new Date()).toISOString().substring(11, 16) // format(new Date(), 'HH:mm')
    }
  },
  methods: {
    changeTime () {
      this.$refs.menu.save(this.time)
      this.$emit('input', this.time)
    },
    formatTime (time) {
      if (!time) return null
      const [hour, min] = time.split(':')
      return (new Date(2000, 1, 1, hour, min)).toISOString().substring(11, 16) // format(new Date(2000, 1, 1, hour, min), this.format)
    }
  }
}
</script>
