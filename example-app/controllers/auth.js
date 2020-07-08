const axios = require('axios')
const { SALT_ROUNDS, HTTPONLY_TOKEN, JWT_EXPIRY } = global.CONFIG
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = global.CONFIG
const { findUser, createToken, revokeToken, logout, refresh, login, otp } = require(LIB_PATH + '/auth')

const signup = async (req, res) => {
  // let encryptedPassword = bcrypt.hashSync(clearPassword, SALT_ROUNDS)
  res.status(201).end()
}

const checkGithub = async (req, res) => {
  try {
    const { code, state } = req.body
    const { data } = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code, state
    }, {
      headers: {
        Accept: 'application/json'
      }
    })
    const rv = await axios.get('https://api.github.com/user?access_token=' + data.access_token)
    const githubId = rv.data.id // github id, email
    const user = await findUser({ githubId }) // match github id (or email?) with our user in our application
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    const { id, groups } = user
    const tokens = await createToken({ id, verified: true, groups }, {expiresIn: JWT_EXPIRY}) // 5 minute expire for login
    if (HTTPONLY_TOKEN) res.setHeader('Set-Cookie', [`token=${tokens.token}; HttpOnly; Path=/;`]); // may need to restart browser, TBD set Max-Age,  ALTERNATE use res.cookie, Signed?, Secure?, SameSite=true?
    return res.status(200).json(tokens)
  } catch (e) {
    console.log('github auth err', e.toString())
  }
  return res.status(401).end()
}

const me = async (req, res) => {
  try {
    const { id } = req.decoded
    // you can also get more user information from here from a datastore
    return res.status(200).json({ user: id, ts: Date.now() })
  } catch (e) {
    console.log(e.toSting())
  }
  return res.status(401).json({ message: 'Error token revoked' })
}

module.exports = {
  logout, refresh, login, otp, signup, me, checkGithub
}