import { Stitch, UserPasswordCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk' // AnonymousCredential
// import { UserPasswordAuthProviderClient } from 'mongodb-stitch-browser-sdk' // AnonymousCredential
// import BSON from 'bson'
// const { ObjectId, Decimal128 } = BSON // Decimal128.fromString()

// stitch.auth.loginWithCredential(new AnonymousCredential())
// stitch.callFunction('Greet', ['Max'])
// auto login
// Stitch.defaultAppClient.auth.addAuthListener(auth => {
//   this.setState({isAuth: auth.isLoggedIn});
// })

// await mongodb.db('shop').collection('products').deleteOne({ _id: new BSON.ObjectId(productId) })

export const getUserPasswordCredential = (user, password) => {
  return new UserPasswordCredential(user, password)
}

export const stitch = Stitch.initializeDefaultAppClient(process.env.VUE_APP_MONGO_STITCH)

export const mongo = Stitch.defaultAppClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')

export const atlasLogin = async (user, password) => {
  try {
    const credential = new UserPasswordCredential(user, password)
    let rv = await stitch.auth.loginWithCredential(credential)
    console.log(rv)
    // const emailPassClient = stitch.auth.getProviderClient(UserPasswordAuthProviderClient.factory)
    // await emailPassClient.registerWithEmail(authData.email, authData.password)
  } catch (e) {
    console.log(e.toString())
  }
}

/*
async testStitch () {
  // await atlasLogin('aaronjxz@gmail.com', '123456')
  const rv = await mongo.db('testdb').collection('testcol').find({}).toArray()
  console.log('rv', rv)
},

import { mongo } from '@/mongo' // atlasLogin, mongo

*/
