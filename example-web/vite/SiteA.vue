<template>
  <div>
    [<router-link to="/">Home</router-link>] [<router-link to="/site-b">Site B</router-link>]
    <h1>Site A</h1>
    <div v-for="(item, i) in list" :ref="el => { divs[i] = el }">{{ item }}</div>
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
