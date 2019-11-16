<template>
  <v-container fluid>
    <drawing-canvas />
    <web-cam />
     <v-btn @click="testAuth">Test Auth</v-btn>
  </v-container>
</template>

<script>
import { http } from '@/axios'
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
  }),
  methods: {
    async testAuth () {
      // try {
      //   const rv = await http.get('/api/auth/me')
      //   console.log(rv.data)
      // } catch (e) {
      //   console.log(e.toString())
      // }
      // try {
      //   const { data } = await http.get(`/api/authors/1`)
      //   console.log(data)
      // } catch (e) {
      //   console.log(e.toString())
      // }
    }
  }
}
</script>
