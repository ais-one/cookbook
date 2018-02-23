import Firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/storage'
import {firebaseCfg} from '../cfg.json'

const firebaseApp = Firebase.initializeApp(firebaseCfg)

const storage = firebaseApp.storage()
const db = firebaseApp.database()
const firestore = firebaseApp.firestore()
const auth = firebaseApp.auth()
export { db, auth, firestore, storage }
