<template>
  <div>
    <v-layout row wrap class="py-2">
      <v-flex xs12>
        <v-card class="elevation-12">
          <v-toolbar dense dark class="secondary">
            <v-toolbar-title>TEST</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container fluid>
              <v-layout row wrap>
                <v-flex xs12>
                  <h2 class="py-2 text-xs-center">Test Your Other Stuff Here</h2>
                  <p class="py-2 text-xs-center">Click on the top left menu icon to navigate</p>
                  <p class="py-2 text-xs-center">On this page, websocket messages are sent to server every 10 seconds (websocket must be enabled .env file). Message will appear server console.log</p>
                  <p class="py-2 text-xs-center">Message to server will be echoed back here... ({{ wsMsg }})</p>
                  <p class="py-2 text-xs-center">
                    <v-btn @click="testGraphQL">Test GraphQL</v-btn>
                  </p>
                  <p class="py-2 text-xs-center">GraphQL Query Result... ({{ hello }})</p>
                  <!--  SINGLE FILE -->
                  <!-- <form action="/uploadfile" enctype="multipart/form-data" method="POST">
                    <input type="file" name="myFile" />
                    <input type="submit" value="Upload a file"/>
                  </form> -->
                  <!-- MULTIPLE FILES -->
                  <!-- <form action="/uploadmultiple"  enctype="multipart/form-data" method="POST">
                    Select images: <input type="file" name="myFiles" multiple>
                    <input type="submit" value="Upload your files"/>
                  </form> -->
                  <!--   PHOTO-->
                  <!-- <form action="/upload/photo" enctype="multipart/form-data" method="POST">
                    <input type="file" name="myImage" accept="image/*" />
                    <input type="submit" value="Upload Photo"/>
                  </form> -->
                </v-flex>
              </v-layout>
              <!-- There will be several rows -->
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// import { http } from '@/axios'
import gql from 'graphql-tag'

/*
<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>File
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
      </label>
      <button v-on:click="submitFile()">Submit</button>
    </div>
  </div>
</template>
file: ''
submitFile(){
  // Initialize the form data
  let formData = new FormData();
  // Add the form data we need to submit
  formData.append('file', this.file);
  // Make the request to the POST /single-file URL
  axios.post( '/single-file',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  ).then(function(){
    console.log('SUCCESS!!');
  })
  .catch(function(){
    console.log('FAILURE!!');
  });
}
// Handles a change on the file upload
handleFileUpload(){
  this.file = this.$refs.file.files[0];
}
<template>
  <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>Files
        <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()"/>
      </label>
      <button v-on:click="submitFiles()">Submit</button>
    </div>
  </div>
</template>

  export default {
      // Defines the data used by the component
    data(){
      return {
        files: ''
      }
    },

    methods: {
        // Submits all of the files to the server
      submitFiles(){
          // Initialize the form data
        let formData = new FormData();

        // Iteate over any file sent over appending the files to the form data.
        for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];

          formData.append('files[' + i + ']', file);
        }

        // Make the request to the POST /multiple-files URL
        axios.post( '/multiple-files',
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
        ).then(function(){
          console.log('SUCCESS!!');
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
      },

      //  Handles a change on the file upload
      handleFilesUpload(){
        this.files = this.$refs.files.files;
      }
    }
  }
*/
export default {
  name: 'dashboard',
  components: {
  },
  apollo: {
    // Query with parameters
    hello: {
      // gql query
      query: gql`query DoHello($message: String!) {
        hello(message: $message)
      }`,
      // Static parameters
      variables: {
        message: 'Meow'
      }
      // skip() {
      //   return this.skipQuery
      // }
    }
  },
  data () {
    return {
      // skipQuery: true,
      hello: 'NA',
      wsMsg: 'No WS Message Yet'
    }
  },
  created () {
    this.$apollo.queries.hello.skip = true
    this.priceTimerId = null
  },
  beforeDestroy () {
    if (this.$socket) {
      delete this.$options.sockets.onmessage
      clearInterval(this.priceTimerId)
    }
  },
  async mounted () {
    if (this.$socket) {
      this.$options.sockets.onmessage = (rv) => {
        // console.log('onmessage', rv) // create listener
        const data = JSON.parse(rv.data)
        // console.log('onmessage', typeof JSON.parse(rv.data))
        this.wsMsg = data.args
      }
      // this.$store.getters.user.token
      this.priceTimerId = setInterval(async () => {
        this.$socket.sendObj({
          call: 'msg-from-client',
          args: 'Hello from client! ' + parseInt(Date.now() / 1000)
        })
        if (navigator.onLine) this.updateNetworkError(false)
        else this.updateNetworkError(true)
      }, 10000)
    }
  },
  methods: {
    async testGraphQL () {
      this.$apollo.queries.hello.skip = false
      await this.$apollo.queries.hello.refetch()
      // alert('Test2 ' + this.hello)
    },
    updateNetworkError (flag) {
      this.$store.dispatch('setNetworkError', flag)
    }
  }
}
</script>
