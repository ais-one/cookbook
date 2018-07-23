<template>
  <div>
    <input type="file" @change="onFileChanged" style="display:none;" ref="fileInput" accept="image/*">
    <v-btn raised @click="$refs.fileInput.click()">Pick File {{ url }}</v-btn>
    <v-btn @click="onUpload" :disabled="disableUploadBtn">Upload!</v-btn>
    <v-avatar v-if="imageUrl">
      <img :src="imageUrl" alt="No Image Loaded">
    </v-avatar>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <v-btn fab flat @click="snackbar=false"><v-icon >close</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// TBD better bucket name, save image immediately?

// https://academind.com/learn/vue-js/snippets/image-upload/
// store file on firebase - https://www.youtube.com/watch?v=qZ1EFnFOGvE
// import axios from 'axios'
import * as firebase from '@/firebase'
export default {
  props: {
    url: { type: String, default: '' } // sync
  },
  data () {
    return {
      disableUploadBtn: false,
      selectedFile: null,
      imageUrl: '',
      image: null,
      snackbar: false,
      snackbarText: '',
      bucket: 'http://storage.googleapis.com/mybot-live.appspot.com'
    }
  },
  mounted () {
    console.log(this.url, this.bucket)
    if (this.url) this.imageUrl = this.bucket + this.url
  },
  methods: {
    setSnackBar (text) {
      this.snackbar = true
      this.snackbarText = text
    },
    onFileChanged (event) {
      // this.selectedFile = event.target.files[0]
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return this.setSnackBar('Please add a valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
        // console.log('addEventListener', this.imageUrl)
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0] // base64
      // console.log('fileReader', this.image)
    },
    async onUpload () {
      this.disableUploadBtn = true
      if (!this.image) {
        this.disableUploadBtn = false
        return this.setSnackBar('Error onUpload')
      }
      const filename = this.image.name
      const ext = filename.slice(filename.lastIndexOf('.'))
      if (ext !== 'jpg') { // limit mime/type
        return this.setSnackBar('Only JPG allowed')
      }
      // TBD limit file size
      this.setSnackBar(`Uploading ${filename}`)
      try {
        let rv = await firebase.storage.ref('mystore/' + filename).put(this.image)
        const theUrl = `/mystore/${filename}` // bucket name
        this.$emit('update:url', theUrl)
        this.setSnackBar(rv.metadata.downloadURLs[0])
      } catch (e) {
        this.setSnackBar('Error Saving Upload')
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
