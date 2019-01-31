<template>
  <div>
    <div><video ref="video" id="video" width="640" height="480" autoplay></video></div>
    <div><button id="snap" v-on:click="capture()">Snap Photo</button></div>
    <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
    <ul>
      <li v-for="c in captures" :key="c">
        <img v-bind:src="c" height="50" />
      </li>
    </ul>
  </div>
</template>

<script>
// canvas.toDataURL("image/png")
export default {
  data () {
    return {
      video: {},
      canvas: {},
      captures: []
    }
  },
  mounted () {
    this.video = this.$refs.video
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.src = window.URL.createObjectURL(stream)
        this.video.play()
      })
    }
  },
  methods: {
    capture () {
      this.canvas = this.$refs.canvas
      // const context =
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 640, 480)
      this.captures.push(this.canvas.toDataURL('image/png'))
    }
  }
}
</script>

<style scoped>
body {
   background-color: #F0F0F0;
}
#app-not-in-use {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#video {
  background-color: #000000;
}
#canvas {
  display: none;
}
li {
  display: inline;
  padding: 5px;
}
</style>
