const jwt = require('jsonwebtoken')
const {db} = require('../firebase')

module.exports = {
  authUser: async (req, res, next) => {
    const token = req.headers.token
    try {
      const decoded = jwt.verify(token, 'secret')
      const firestoreUser = await db.collection('user').doc(decoded.uid).get()
      if (firestoreUser.exists) {
        let tmp = firestoreUser.data()
        if (tmp.token === token) {
          req.uid = decoded.uid
          req.adminUid = tmp.adminUid
          req.isAdmin = decoded.uid === tmp.adminUid // user is admin
          // We can possibly use Firebase rules also...
          req.isAssetAdmin = (adminUid) => decoded.uid === adminUid // user is admin and owns the adminUid
          req.isAssetOwner = (uid) => decoded.uid === uid // user is admin and owns the adminUid
          return next()
        }
      }
    } catch (e) { }
    return res.status(403).end()
  },
  processError: (e) => {
    const messages = {
      '200': 'Ok',
      '201': 'Created',
      '400': 'Client Error',
      '403': 'Forbidden',
      '404': 'Not Found',
      '422': 'Invalid Input'
    }
    let status = '500'
    let data = 'Server Error'
    try {
      data = messages[e.message]
      status = e.message
    } catch(e) { }
    return { status, data }
  }
}