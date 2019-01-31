<script>
export default {
  name: 'muli-crud-party-notes-filter',
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
    <h1>Custom Party Notes Filter</h1>
    <div v-for="(filter, index) in filterData" :key="index">
      <component :is="filter.type" v-model="filter.value" v-bind="filter.attrs"></component>
    </div>
  </div>
</template>
