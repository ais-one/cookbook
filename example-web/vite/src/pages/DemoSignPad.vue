
<template>
  <div class="container">
    <h1>Sign Pad Custom Element</h1>
    <vcxwc-sign-pad width="200" height="200" v-model="imageDataUrl" context2d='{ "lineWidth": 2, "strokeStyle": "#00f" }'></vcxwc-sign-pad>
    <p><button @click="signDataFn">See Signature Data</button></p>
  </div>
</template>

<script>
import '../lib/esm/sign-pad.js'
import { ref } from 'vue'

export default {
  name: 'SignPad',
  setup() {
    const imageDataUrl = ref('')

    const signDataFn = (e) => {
      alert('see console log for signature data')
      console.log('imageDataUrl', imageDataUrl.value)
    } 

    return {
      imageDataUrl,
      signDataFn
    }
  }
}
</script>

<style scoped>
vcxwc-sign-pad {
  --vcxwc-sign-pad-background-color: #faa;
}
</style>
