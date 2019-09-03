import Firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/storage'
import { firebaseCfg } from '../cfg.json'
// let { firebaseCfg = '' } = import('../cfg.json')

let firebaseApp, storage, firestore, auth, secondaryApp, auth2

if (firebaseCfg && firebaseCfg.apiKey) {
  firebaseApp = Firebase.initializeApp(firebaseCfg)
  storage = firebaseApp.storage()
  firestore = firebaseApp.firestore()
  auth = firebaseApp.auth()

  // for auth user creation
  secondaryApp = Firebase.initializeApp(firebaseCfg, 'Secondary')
  auth2 = secondaryApp.auth()
}

// for duplicate detection - to remove
const hasDuplicate = async (collection, key, value, id = null) => {
  try {
    if (id) { // update
      const rv = await firestore.collection(collection).where(key, '==', value).limit(1).get()
      if (rv.size === 0) return false
      let sameId = false
      rv.forEach(doc => {
        if (doc.id === id) sameId = true
      })
      if (sameId) return false
    } else { // insert
      const rv = await firestore.collection(collection).where(key, '==', value).limit(1).get()
      if (rv.size === 0) return false
    }
  } catch (e) { }
  return true
}

export { auth, auth2, firestore, storage, hasDuplicate }
