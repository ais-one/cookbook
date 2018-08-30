<template>
  <div class="pa-2">
    <input type="file" @change="onFileChanged" style="display:none;" ref="fileInput" accept="image/*">
    <v-btn raised @click="$refs.fileInput.click()">Pick File</v-btn>
    <v-btn @click="onUpload" :disabled="disableUploadBtn">Upload!</v-btn>
    <v-avatar v-if="imageSrc||imageUrl">
      <img :src="imageSrc || imageUrl" alt="No Image Loaded">
    </v-avatar>
    <v-btn v-if="imageUrl" :href="`${imageUrl}`" target="_blank">{{ storageRef }}</v-btn>
    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <v-btn fab flat @click="snackbar=false"><v-icon >close</v-icon></v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// https://academind.com/learn/vue-js/snippets/image-upload/
// store file on firebase - https://www.youtube.com/watch?v=qZ1EFnFOGvE
// import axios from 'axios'
import * as firebase from '@/firebase'
export default {
  props: {
    storageRef: { type: String, default: '' }, // sync

    bucket: { type: String, required: true }, // viewing URL
    path: { type: String, default: '' }, // e.g. "mystore/"
    filename: { type: String, default: '' }, // if empty, use uploaded filename

    collection: { type: String, required: true }, // for firestore update
    id: { type: String, required: true },
    field: { type: String, required: true },

    removeOld: { type: Boolean, default: true } // remove existing record
  },
  data () {
    return {
      disableUploadBtn: false,
      selectedFile: null,

      imageUrl: '',

      imageSrc: '',
      image: null,

      snackbar: false,
      snackbarText: ''
    }
  },
  mounted () {
    if (this.storageRef) this.imageUrl = this.bucket + this.storageRef
  },
  methods: {
    setSnackBar (text) {
      this.snackbar = true
      this.snackbarText = text
    },
    onFileChanged (event) {
      // this.selectedFile = event.target.files[0]
      const files = event.target.files
      if (!files.length) return

      let tmpFilename = files[0].name
      if (tmpFilename.lastIndexOf('.') <= 0) {
        return this.setSnackBar('Please add a valid file')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageSrc = fileReader.result
        // console.log('addEventListener', this.imageSrc)
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
      const tmpFilename = this.image.name
      const ext = tmpFilename.slice(tmpFilename.lastIndexOf('.')).toLowerCase()
      if (ext !== '.jpg' && ext !== '.png') { // limit mime/type or use this.image.type to filter
        this.disableUploadBtn = false
        return this.setSnackBar('Only JPG / PNG files allowed')
      }

      const maxSize = 10000000
      // const maxSize = 1
      if (this.image.size > maxSize) {
        this.disableUploadBtn = false
        return this.setSnackBar('Only 10MB allowed')
      }

      if (this.removeOld && this.storageRef) {
        this.setSnackBar(`Removing Old Image`)
        try {
          await firebase.storage.ref(this.storageRef).delete()
          await firebase.firestore.doc(this.collection + '/' + this.id).update({ [this.field]: '' })
        } catch (e) {
          this.disableUploadBtn = false
          return this.setSnackBar('Remove old image fail')
        }
        this.setSnackBar(`Removing Done`)
      }

      this.setSnackBar(`Uploading`)
      try {
        let ref = this.path
        if (!this.filename) ref += tmpFilename
        else ref += this.filename

        let rv = await firebase.storage.ref(ref).put(this.image)
        const theUrl = `/${ref}` // bucket name

        await firebase.firestore.doc(this.collection + '/' + this.id).update({ [this.field]: theUrl })

        this.$emit('update:storageRef', theUrl)
        this.imageUrl = this.bucket + theUrl

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
