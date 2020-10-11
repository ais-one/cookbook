<template>
  <v-container fluid>
    <v-flex xs12 sm6>
      <v-file-input
        show-size
        label="Upload To GCP Storage"
        @change="onUploadFileToFirebase"
        accept="image/jpeg, .pdf, .txt"
        outlined
        dense
      ></v-file-input>
    </v-flex>

  </v-container>
</template>

<script>
import { http } from '@/axios'

 // <v-img v-if="selectedImageFileName" :src="'https://storage.googleapis.com/mybot-live.appspot.com/mystore/' + encodeURIComponent(selectedImageFileName)"/>
export default {
  components: {
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
        const { data } = await http.post(`/api/gcp-sign`, {
          filename: fileObj.name,
          action: 'write'
        })
        await http.put(data.url, fileObj, {
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
