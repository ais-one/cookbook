<template>
  <div class="container">
    <h1>Web Cam Custom Element</h1>
    <vcxwc-web-cam @snap="snappedFn" width="320" height="240">
      <button slot="button-snap" class="button" id="snap">Take Photo</button>
      <button slot="button-unsnap" class="button" id="unsnap">Start Camera</button>
    </vcxwc-web-cam>
  </div>
</template>

<script>
import '/@es-labs/esm/web-cam.js' // served from express /esm static route

export default {
  name: 'WebCam',
  setup() {
    const snappedFn = (e) => {
      alert('see console log for snapped picture data')
      console.log('snappedFn', e.detail)
    }
    return {
      snappedFn
    }
  }
}
</script>

<style scoped>
vcxwc-web-cam {
  --vcxwc-web-cam-top: 5%;
  --vcxwc-web-cam-right: 5%;
}
</style>
