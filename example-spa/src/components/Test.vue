<template>
  <v-container fluid>
    <drawing-canvas />
    <web-cam />
  </v-container>
</template>

<script>
import DrawingCanvas from '../../../src/DrawingCanvas'
import WebCam from '../../../src/WebCam'

// import DrawingCanvas from '@/components/DrawingCanvas'
// import WebCam from '@/components/WebCam'

export default {
  components: {
    DrawingCanvas,
    WebCam
  },
  data: () => ({ // try not to use this way due to scoping issues
    isLoading: false
  })
}
</script>
