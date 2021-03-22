'use strict'

const { authUser, findUser, updateUser } = require('@es-labs/node/auth')

const authIsAdmin = async (req, res, next) => {
  if (req.decoded.groups.includes('admin')) {
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