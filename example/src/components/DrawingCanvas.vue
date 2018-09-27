<template>
  <canvas id="canvas" @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mousemove="handleMouseMove" :width="'200px'" :height="'200px'"></canvas>
</template>

<script>
// canvas.toDataURL("image/png")
export default {
  data () {
    return {
      mouse: {
        current: { x: 0, y: 0 },
        previous: { x: 0, y: 0 },
        down: false
      }
    }
  },
  computed: {
    currentMouse () {
      var c = document.getElementById('canvas')
      var rect = c.getBoundingClientRect()
      return {
        x: this.mouse.current.x - rect.left,
        y: this.mouse.current.y - rect.top
      }
    }
  },
  mounted () {
    var c = document.getElementById('canvas')
    var ctx = c.getContext('2d')
    ctx.translate(0.5, 0.5)
    ctx.imageSmoothingEnabled = false
    // this.draw()
  },
  methods: {
    draw (event) {
      // requestAnimationFrame(this.draw)
      if (this.mouse.down) {
        var c = document.getElementById('canvas')
        var ctx = c.getContext('2d')
        ctx.clearRect(0, 0, 800, 800)
        ctx.lineTo(this.currentMouse.x, this.currentMouse.y)
        ctx.strokeStyle = '#F63E02'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    },
    handleMouseDown (event) {
      this.mouse.down = true
      this.mouse.current = {
        x: event.pageX,
        y: event.pageY
      }
      var c = document.getElementById('canvas')
      var ctx = c.getContext('2d')
      ctx.moveTo(this.currentMouse.x, this.currentMouse.y)
    },
    handleMouseUp () {
      this.mouse.down = false
    },
    handleMouseMove (event) {
      this.mouse.current = {
        x: event.pageX,
        y: event.pageY
      }
      this.draw(event)
    }
  }
}
</script>

<style scoped>
canvas {
   background-color: #ddd;
}
</style>
