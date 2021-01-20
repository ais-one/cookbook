'use strict'

const { authUser, findUser, updateUser } = require(LIB_PATH + '/auth')

const authIsAdmin = async (req, res, next) => {
  if (req.decoded.groups === 'admin') {
    return next()
  }
  else {
    return res.status(401).json({ error: 'Not Allowed' })
  }
}

module.exports = {
  authUser,
  findUser,
  updateUser,
  authIsAdmin
}