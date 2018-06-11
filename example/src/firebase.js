import Firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'
import {firebaseCfg} from '../cfg.json'

const firebaseApp = Firebase.initializeApp(firebaseCfg)

const storage = firebaseApp.storage()
const db = firebaseApp.database()
const firestore = firebaseApp.firestore()
const auth = firebaseApp.auth()
const hasDuplicate = async (collection, key, value, id = null) => {
  try {
    if (id) { // update
      const rv = await firestore.collection(collection).doc(id).get()
      if (rv.exists) {
        const data = rv.data()
        if (data[key] === value) return false
      }
    } else { // insert
      const rv = await firestore.collection(collection).where(key, '==', value).limit(1).get()
      if (rv.size === 0) return false
    }
  } catch (e) { }
  return true
}

export { db, auth, firestore, storage, hasDuplicate }
