<script>
export default {
  name: 'party-filter',
  props: ['parentId', 'filters'], // static
  async mounted () {
    for (var key in this.filters) {
      if (this.filters[key].itemsFn) this.filters[key].items = await this.filters[key].itemsFn()
    }
  }
}
</script>

<template>
  <div>
    <div v-for="(filter, index) in filters" :key="index">
      <component :is="filter.type" v-model="filter.value" v-bind="filter.attrs"></component>
    </div>
  </div>
</template>
