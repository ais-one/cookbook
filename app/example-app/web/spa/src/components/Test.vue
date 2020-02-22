<template>
  <v-container fluid>
    <drawing-canvas />
    <web-cam />
     <v-btn @click="testAuth">Test Auth</v-btn>
  </v-container>
</template>

<script>
import DrawingCanvas from '../../../../../../common-ui/DrawingCanvas'
import WebCam from '../../../../../../common-ui/WebCam'

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
      // const url = '/api/auth/me' // `/api/authors/1`
      // try {
      //   const { data } = await this.$http.get(url)
      //   console.log(data)
      // } catch (e) {
      //   console.log(e.toString())
      // }
    }
  }
}
</script>
