<template>
  <div>
    <v-layout row ref="pageTop" v-scroll="onScroll"><!--  v-scroll:#scroll-target="onScroll"  v-scroll="onScroll" -->
      <v-flex xs12>
        <h2>You can add various components, cruds, a chart, map, etc.</h2>
        <p>The clicking an item in left table will do a find() records in right table where Party Name matches Party. The right table also has the goBack() button to return to parent turned off</p>
      </v-flex>
    </v-layout>
    <v-layout row wrap style="max-height: 200px">
      <v-flex xs12 sm6>
        <h3>Files List...</h3>
        <div v-if="!loading">
          <ul v-for="(file, i) in files" :key="i">
            <li @click="selectedImageFileName=file.name">{{ file.name }}</li>
          </ul>
        </div>
        <div v-else>
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <app-file-upload v-model="imageObj" />
        <v-btn @click="onUpload" :disabled="loading">Upload!</v-btn>
      </v-flex>
      <v-flex xs12 sm6>
        <h3>TBD Show Image Here</h3>
        <v-img v-if="selectedImageFileName" :src="'https://storage.googleapis.com/mybot-live.appspot.com/mystore/' + encodeURIComponent(selectedImageFileName)"/>
      </v-flex>
      <v-flex xs12 sm6>
        <v-container>
          <v-card v-for="n in 3" :key="n">
            <v-img src="https://via.placeholder.com/350x150" height="150px"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Kangaroo Valley Safari</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn color="orange">Share</v-btn>
              <v-btn color="orange">Explore</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
    <v-btn v-if="offsetTop" fab fixed dark bottom right @click.stop="scrollToTop"><v-icon>arrow_upward</v-icon></v-btn>
  </div>
</template>

<script>
// ## Firebase Storage Rules
// rules_version = "2"
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if request.auth != null;
//     }
//   }
// }
// https://academind.com/learn/vue-js/snippets/image-upload/
// store file on firebase - https://www.youtube.com/watch?v=qZ1EFnFOGvE

// scroll ok for now, wait for V2 to stabilize to see if can be improved further

import { storage } from '@/firebase'

export default {
  name: 'firebase-storage',
  data () {
    return {
      loading: false,
      // bucket: 'gs://mybot-live.appspot.com',
      // storageRef: '/mystore',
      offsetTop: 0,
      imageObj: { savedUrl: '', imageName: '', imageUrl: '', imageFile: '' },
      files: [],
      selectedImageFileName: ''
    }
  },
  async created () {
    try {
      this.loading = true
      // list firebase storage
      const storageRef = storage.ref().child('mystore')

      const listRef = storageRef
      const res = await listRef.listAll()
      // res.prefixes.forEach(function(folderRef) {
      //   // All the prefixes under listRef. You may call listAll() recursively on them.
      // })
      res.items.forEach((itemRef) => { // All the items under listRef.
        // console.log(itemRef)
        this.files.push(itemRef)
      })
      this.loading = false
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    scrollToTop () {
      this.$nextTick(function () {
        // this.$refs.pageTop.scrollIntoView()
        window.scrollTo(0, 0)
      })
    },
    onScroll (e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
      // this.offsetTop = e.target.scrollTop
    },
    async onUpload () {
      this.loading = true
      // console.log(this.imageObj.imageFile, this.imageObj.imageUrl) // the data
      if (!this.imageObj.imageFile) return alert('No File Selected')
      const info = this.imageObj.imageFile
      // const tmpFilename = info.name
      // const ext = tmpFilename.slice(tmpFilename.lastIndexOf('.')).toLowerCase()
      // if (ext !== '.jpg' && ext !== '.png') return alert('Only JOG')
      const maxSize = 65535
      if (info.size > maxSize) return alert('File Size limited to 64kb')
      // await firebase.storage.ref(this.storageRef).delete()
      try {
        const storageRef = storage.ref().child('mystore/' + info.name)
        let rv = await storageRef.put(info) // it will overwrite...
        console.log(rv)
        // const theUrl = `/${ref}` // bucket name
        // this.imageUrl = this.bucket + theUrl
        // this.setSnackBar(rv.metadata.downloadURLs[0])
      } catch (e) {
        console.log(e)
        // alert('Error Saving')
      }
      this.loading = false
    }
    // onFileChanged (event) {
    //   // this.selectedFile = event.target.files[0]
    //   const files = event.target.files
    //   if (!files.length) return
    //   let tmpFilename = files[0].name
    //   if (tmpFilename.lastIndexOf('.') <= 0) {
    //     return this.setSnackBar('Please add a valid file')
    //   }
    //   const fileReader = new FileReader()
    //   fileReader.addEventListener('load', () => {
    //     this.imageSrc = fileReader.result
    //     // console.log('addEventListener', this.imageSrc)
    //   })
    //   fileReader.readAsDataURL(files[0])
    //   this.image = files[0] // base64
    //   // console.log('fileReader', this.image)
    // }
  }
}
</script>
