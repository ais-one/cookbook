<template>
  <div class="file-upload">
    <v-text-field
      :label="value.savedUrl ?  `Current file ${value.savedUrl}`:' N.A.'"
      @click="pickFile"
      v-model="imageName"
      prepend-icon="attach_file"
      readonly
      clearable
      @click:clear="resetData"
    ></v-text-field>
    <input type="file" style="display: none" ref="image" accept="*/*" @change="onFilePicked" />
  </div>
</template>

<script>
// https://jsfiddle.net/meyubaraj/fLbe7r72/
// https://codepen.io/Atinux/pen/qOvawK/

export default {
  props: {
    accept: { type: String, default: '*/*' },
    value: { type: Object, required: true }
  },
  data () {
    return {
      savedUrl: '',
      imageName: '',
      imageUrl: '',
      imageFile: ''
    }
  },

  mounted () {
    // console.log('file upload mounted', this.value)
  },

  methods: {
    pickFile () {
      this.$refs.image.click()
    },
    resetData () {
      this.imageName = ''
      this.imageFile = ''
      this.imageUrl = ''
      this.$emit('input', {
        savedUrl: this.value.savedUrl,
        imageName: this.imageName,
        imageUrl: this.imageUrl,
        imageFile: this.imageFile
      })
    },
    onFilePicked (e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
          // console.log('uploading', this.imageUrl, this.imageFile)
          this.$emit('input', {
            savedUrl: this.value.savedUrl,
            imageName: this.imageName,
            imageUrl: this.imageUrl,
            imageFile: this.imageFile
          })
        })
      } else {
        this.resetData()
      }
    }
  }
}
</script>
