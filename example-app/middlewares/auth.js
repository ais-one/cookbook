const { authUser, findUser, updateUser } = require(LIB_PATH + '/auth')

const authIsAdmin = async (req, res, next) => {
  if (req.decoded.groups === 'admin') {
    return next()
  }
  else {
    return res.status(401).json({ e: 'Not Allowed' })
  }
}

module.exports = {
  authUser,
  findUser,
  updateUser,
  authIsAdmin
}