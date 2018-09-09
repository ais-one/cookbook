const {db, auth} = require('../firebase')

module.exports = {
  createUser: async (email, password, adminUid = null) => {
    try {
      const user = await auth.createUser({
        email,
        password,
        disabled: false
      })
      await db.collection('user').doc(user.uid).set({
        email: email,
        hash: password,
        uid: user.uid,
        adminUid: adminUid ? adminUid : user.uid,
        quotaAllocated: 0,
        quotaUsed: 0
      })
      return 201
    } catch (e) { return 500 }
  },
  getById: async (collection, id, uid, adminUid) => {
    try {
      const doc = await db.collection(collection).doc(id).get()
      if (doc.exists) {
        const data = doc.data()
        data.id = doc.id
        if (data.uid === uid || (uid === adminUid && data.adminUid === adminUid)) 
          return { status: 200, data }
        else
          return { status: 403, data: {} }
      } else
        return { status: 404, data: {} }
    } catch (e) { return { status: 500, data: {} } }
  }
}