<template>
  <v-container fluid>
    <drawing-canvas />
    <web-cam />
    <v-flex xs12 sm6>
      <v-file-input
        show-size
        label="Upload To GCP Storage"
        @change="onUploadFileToFirebase"
        accept="image/jpeg, .pdf, .txt"
        outlined
        dense
      ></v-file-input>
      <!-- <v-img v-if="selectedImageFileName" :src="'https://storage.googleapis.com/mybot-live.appspot.com/mystore/' + encodeURIComponent(selectedImageFileName)"/> -->
    </v-flex>

  </v-container>
</template>

<script>
import { http } from '@/axios'
import WebCam from '../../../../../common-web/WebCam'
import DrawingCanvas from '../../../../../common-web/DrawingCanvas'

export default {
  components: {
    DrawingCanvas,
    WebCam
  },
  data: () => ({ // try not to use this way due to scoping issues
    isLoading: false
  }),
  methods: {
    async onUploadFileToLocal (fileObj) {
      if (fileObj) {
        // const formData = new FormData();
        // formData.append("somefile", fileObj);
        // const { data } = await http.patch(`/api/upload-local`, formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data"
        //   }
        // })
      }
      console.log(fileObj)
    },
    async onUploadFileToFirebase (fileObj) { // firebase account required
      try {
        const { data } = await http.post(`/api/firebase-upload`, {
          filename: fileObj.name,
          action: 'write'
        })
        const rv = await http.put(data.url, fileObj, {
          // withCredentials: true,
          headers: { 'Content-Type': 'application/octet-stream' }
        })
        // console.log('done', rv)
      } catch (e) {
        // console.log(e.toString())
      }
    }
  }
}
</script>
