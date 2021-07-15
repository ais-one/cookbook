'use strict'

const authIsAdmin = async (req, res, next) => {
  if (req.decoded.groups.includes('admin')) {
    return next()
  }
  else {
    return res.status(401).json({ error: 'Not Allowed' })
  }
}

module.exports = {
  authIsAdmin
}
