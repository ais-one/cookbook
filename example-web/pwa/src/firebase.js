import Firebase from '@firebase/app'
import '@firebase/messaging'

import { VAPID_KEY, FIREBASE_CONFIG } from '@/config'
// console.log('VAPID_KEY', VAPID_KEY)
// console.log('FIREBASE_CONFIG', FIREBASE_CONFIG)

let messaging

if (!messaging) {
  const firebaseApp = Firebase.initializeApp(FIREBASE_CONFIG)
  try {
    messaging = firebaseApp.messaging()
    messaging.usePublicVapidKey(VAPID_KEY)
  } catch (e) {
    messaging = null
    // alert(e.toString())
  }
}

export { messaging }
