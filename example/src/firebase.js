import Firebase from 'firebase'
import 'firebase/firestore'
import {firebaseCfg} from '../cfg.json'

const firebaseApp = Firebase.initializeApp(firebaseCfg)

const db = firebaseApp.database()
const firestore = firebaseApp.firestore()
const auth = firebaseApp.auth()
export { db, auth, firestore }
