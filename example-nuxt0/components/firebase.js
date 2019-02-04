import Firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/storage'

import {firebaseCfg} from '../cfg.json'

const firebaseApp = Firebase.initializeApp(firebaseCfg)

const storage = firebaseApp.storage()
const firestore = firebaseApp.firestore()
const auth = firebaseApp.auth()
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

export { auth, firestore, storage, hasDuplicate }
