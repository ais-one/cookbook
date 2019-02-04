<script>
export default {
  name: 'party-filter',
  props: ['parentId', 'storeName', 'filterData'], // static
  async mounted () {
    for (var key in this.filterData) {
      if (this.filterData[key].itemsFn) this.filterData[key].items = await this.filterData[key].itemsFn()
    }
  }
}
</script>

<template>
  <div>
    <div v-for="(filter, index) in filterData" :key="index">
      <component v-if="filter.type === 'select'" :is="'v-select'" v-model="filter.value" :multiple="filter.multiple" :label="filter.label" :items="filter.items" :rules="filter.rules"></component>
      <component v-if="filter.type === 'select-kv'" :is="'v-select'" v-model="filter.value" :multiple="filter.multiple" :label="filter.label" :items="filter.items" :rules="filter.rules" item-value="value" item-text="text" return-object></component>
      <component v-if="filter.type === 'date'" :is="'v-text-field'" v-model="filter.value" :label="filter.label" :rules="filter.rules" type="date"></component>
      <component v-if="filter.type === 'text'" :is="'v-text-field'" v-model="filter.value" :label="filter.label" :rules="filter.rules" type="text"></component>
    </div>
  </div>
</template>
