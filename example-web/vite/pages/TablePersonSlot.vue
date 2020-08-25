<template>
  <crud-table tableName="person" ref="myroot">
    <template v-slot:filters="{ filters }">
      <div>HELLO {{ filters.length}} {{ myroot.tableName }}</div>
    </template>
  </crud-table>
</template>

<script>
import { onMounted, ref } from 'vue'

import CrudTable from '../components/CrudTable.vue'

export default {
  components: {
    'crud-table': CrudTable
  },
  setup(props, ctx) {
    const myroot = ref(null)
    onMounted(async () => {
      console.log('myroot', myroot.value)
    })
    return {
      myroot
    }
  }

}
</script>
