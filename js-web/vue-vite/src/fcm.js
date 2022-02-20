// FCM
// CONFIG_FIREBASE_CLIENT, CONFIG_VAPID_KEY is global from firebase.config.js
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { getAnalytics } from 'firebase/analytics'

let firebaseApp
let messaging

export const fcmSubscribe = async (registration, refreshFn) => {
  console.log('initializeApp', initializeApp, window.CONFIG_FIREBASE_CLIENT)
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    if (!firebaseApp) {
      firebaseApp = initializeApp(window.CONFIG_FIREBASE_CLIENT)
      getAnalytics(firebaseApp)
    }
    if (!messaging) {
      messaging = getMessaging()

      // NOSONAR
      // messaging.useServiceWorker(registration) // deprecated ??
      // onTokenRefresh // deprecated - https://github.com/firebase/firebase-js-sdk/issues/4132
      // messaging.usePublicVapidKey(window.CONFIG_VAPID_KEY) // deprecated ??

      onMessage(messaging, (payload) => {
        console.log('Message received. ', payload)
        try {
          const { title, body } = JSON.parse(payload.data.notification)
          console.log(new Date().toISOString(), title, body)
          alert(`FCM PN Message title=${title} body=${body}`)
        } catch (e) {
          console.log('GCM msg error', e.toString())
        }
      })
    }
    // ?? if (permission === 'granted') return await messaging.getToken()
    if (permission === 'granted') return await getToken(messaging, { vapidKey: window.CONFIG_VAPID_KEY }) // serviceWorkerRegistration
  } catch (e) {
    console.log('Error initialise firebase app', e.toString())
  }
  return null
}

export const fcmUnsubscribe = async () => {
  if (firebaseApp) {
    try {
      await firebaseApp.delete()
      firebaseApp = null
      messaging = null
    } catch (e) {
      console.log('Error deleting firebase app', e.String())
    }
  }
}
