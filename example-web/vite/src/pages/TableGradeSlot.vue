<template>
  <crud-table table-name="grade" ref="myroot">
    <template #filters="{ filters }">
      <div>HELLO {{ filters.length }} {{ myroot.tableName }}</div>
    </template>
  </crud-table>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import CrudTable from '../components/CrudTable.vue'

export default {
  components: {
    'crud-table': CrudTable
  },
  setup(props, ctx) {
    const route = useRoute()

    const myroot = ref(null)
    onMounted(async () => {
      console.log('TableGradeSlot route', route.query)
      console.log('myroot', myroot.value)
    })
    return {
      myroot
    }
  }
}
</script>
