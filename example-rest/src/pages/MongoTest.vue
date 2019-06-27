
<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card>
          <v-card-text>
            <h1>Logged In Mongo</h1>
            <p v-if="rv===null">Loading DATA!!!</p>
            <ul v-else-if="rv.length">
              <li v-for="(item, index) in rv" :key="index+'-'+item.clientName">{{ item._id }} - {{ item.clientName }}</li>
            </ul>
            <p v-else>No Data Found</p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mongo } from '@/mongo' // atlasLogin, mongo

export default {
  name: 'mongo-test',
  data () {
    return {
      rv: null
    }
  },
  async mounted () {
    try {
      this.rv = await mongo.db('testdb').collection('testcol').find({}).toArray(10)
    } catch (e) {
      this.rv = []
    }
  }
}
</script>
