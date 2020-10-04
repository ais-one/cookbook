<template>
  <div class="container">
    <h1>Site A - Test VueJS 3</h1>
    <div v-for="(item, i) in list" :key="i" :ref="(el) => { divs[i] = el }">
      {{ item }}
    </div>
    <div class="section">
      <div class="box" style="background-color: red">A</div>
      <div class="box" style="background-color: lightblue">B</div>
      <div class="box" style="background-color: yellow">C</div>
      <div class="box" style="background-color: brown">D</div>
      <div class="box" style="background-color: lightgreen">E</div>
      <div class="box" style="background-color: red">A</div>
      <div class="box" style="background-color: brown">G</div>
    </div>
  </div>
</template>

<script>
// unref, toRef, toRefs, isRef, isProxy, isReactive, isReadonly
import { ref, reactive, onBeforeUpdate } from 'vue'

export default {
  name: 'DemoFlex',
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

<style lang="css" scoped>
.section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: space-around;
}

.box {
  width: 200px;
  /* border: 3px solid rgba(0,0,0,.2); */
  /* flex: 1 0 21%; */
  /* width: 25%; */
  margin: 5px;
  height: 100px;
  background-color: blue;
}
</style>
