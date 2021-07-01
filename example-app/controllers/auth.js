'use strict'

const signup = async (req, res) => {
  // let encryptedPassword = bcrypt.hashSync(clearPassword, SALT_ROUNDS)
  res.status(201).end()
}

const me = async (req, res) => {
  try {
    const { id } = req.decoded
    // you can also get more user information from here from a datastore
    return res.status(200).json({ user: id, ts: Date.now() })
  } catch (e) {
    console.log(e.toString())
  }
  return res.status(401).json({ message: 'Error token revoked' })
}

module.exports = {
  signup, me
}