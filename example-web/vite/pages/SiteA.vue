<template>
  <div class="countainer">
    <h1>Site A - Test VueJS 3</h1>
    <div v-for="(item, i) in list" :key="i" :ref="el => { divs[i] = el }">{{ item }}</div>
  </div>
</template>

<script>
/*
unref
toRef
toRefs
isRef
isProxy
isReactive
isReadonly
*/
import { ref, reactive, onBeforeUpdate } from 'vue'

export default {
  name: 'SiteA',
  setup() {
    const list = reactive([1, 2, 3])
    const divs = ref([])
    // make sure to reset the refs before each update
    onBeforeUpdate(() => {
      divs.value = []
    })
    return {
      list,
      divs
    }
  }
}
</script>
