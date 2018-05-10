<template>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-form>
          <input type="file" @change="onFileChanged" style="display:none;" ref="fileInput" accept="image/*">
          <v-btn raised @click="$refs.fileInput.click()">Pick File</v-btn>
          <v-btn @click="onUpload" :disabled="disableUploadBtn">Upload!</v-btn>
          <img :src="imageUrl" height="150">
        </v-form>
      </v-flex>
    </v-layout>
</template>

<script>
  // https://academind.com/learn/vue-js/snippets/image-upload/
  // store file on firebase - https://www.youtube.com/watch?v=qZ1EFnFOGvE
  // import axios from 'axios'
  import * as firebase from '@/firebase'

  export default {
    data () {
      return {
        disableUploadBtn: false,
        selectedFile: null,
        imageUrl: '',
        image: null
      }
    },
    methods: {
      submit () {
      },
      onFileChanged (event) {
        // this.selectedFile = event.target.files[0]

        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
          console.log('addEventListener', this.imageUrl)
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0] // base64
        console.log('fileReader', this.image)
      },
      async onUpload () {
        this.disableUploadBtn = true
        if (!this.image) {
          this.disableUploadBtn = false
          return console.log('error onUpload')
        }

        const filename = this.image.name
        const ext = filename.slice(filename.lastIndexOf('.'))

        console.log('uploading', filename, ext)
        try {
          let rv = await firebase.storage.ref('mystore/' + filename).put(this.image)
          alert(rv.metadata.downloadURLs[0])
        } catch (e) {
          alert('error saving to storage')
        }
        this.disableUploadBtn = false

        // upload file

        // send as binary
        // axios.post('my-domain.com/file-upload', this.selectedFile)

        // send as form
        // axios.post('my-domain.com/file-upload', formData)
      }
      // uploadHandler = () => {
      // const formData = new FormData()
      // formData.append('myFile', this.selectedFile, this.selectedFile.name)
      //   ...
      //   axios.post('my-domain.com/file-upload', formData, {
      //     onUploadProgress: progressEvent => {
      //       console.log(Math.round(progressEvent.loaded / progressEvent.total * 100) + '%')
      //     }
      //   })
      // }
    }
  }
</script>
