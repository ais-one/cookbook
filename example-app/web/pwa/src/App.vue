<template>
  <div>
    <h1>PWA and PN Test</h1>
    <p>PN Token {{ pnToken }}</p>
    <p>Notice: {{ notice }}</p>
  </div>
</template>

<script>
import { messaging } from '@/firebase'
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://127.0.0.1:3000'

const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// 
/*
public/firebase-messaging-sw.js - update version here also
src/firebase.js

$ curl -X POST -H "Authorization: key=${FCM_SERVER_KEY}" -H "Content-Type: application/json" -d '{
  "to": "${User PN token}",
  "data": { "notification": { "title": "FCM Message", "body": "This is an FCM Message" } }
}' https://fcm.googleapis.com/fcm/send

// Callback fired if Instance ID token is updated.
*/

// https://www.itwonders-web.com/blog/push-notification-using-firebase-demo-tutorial

export default {
  data () {
    return {
      pnToken: 'none yet',
      notice: 'none yet'
    }
  },
  created () {
  },
  async mounted () {
    // console.log(this)
    if (messaging) {
      messaging.requestPermission().then(() => {
        // console.log('Notification permission granted.')
        messaging.getToken().then(async (token) => {
          this.sendToken(token)
        })
      }).catch((e) => {
        console.log('Unable to get permission to notify.', e.toString())
      })
      messaging.onTokenRefresh(() => {
        messaging.getToken().then(async (token) => {
          this.sendToken(token)
        }).catch((e) => {
          console.log('Unable to retrieve refreshed token ', e.toString())
        })
      })

      messaging.onMessage((payload) => {
        console.log('Message received. ', payload)
        try {
          const { title, body } = JSON.parse(payload.data.notification)
          this.notice = title + ' ' + body + ' ' + (new Date()).toISOString()
        } catch (e) {
          console.log('GCM msg error', e.toString())
        }
      })
    }
  },
  methods: {
    async sendToken(token) {
      this.pnToken = token + ' ' + (new Date()).toISOString()
      try {
        await http.get('/api/test-pn-token/' + token, { params: { reply: 'no' } }) // yes=reply. no=no reply
      } catch (e) {
        console.log('Error pnToken', e.toString())
      }      
    }
  }
}
</script>
