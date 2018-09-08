let chai = require('chai')
let expect = chai.expect
let should = chai.should()
let chaiHttp = require('chai-http')

let server = require('../index')

const {db, auth} = require('../firebase')

chai.use(chaiHttp);
 
let adminInfo = {
  email: 'email@email.com',
  password: '123456'
}
 
let token = ''

if (0) describe('Create Account, Login, Logout (logging out requires token)', () => {
  // it.only("Does Nothing", () => { })

  before(async () => { // not before each
    try {
      const user = await auth.getUserByEmail(adminInfo.email)
      await auth.deleteUser(user.uid)
      await db.collection('user').doc(user.uid).delete()
    } catch (e) {
      // console.log(e)
    }
    // clear all resources of the admin user
  })

  // describe('DO NOTHING', async () => { it.only("Does Nothing", () => { }) })

  describe('/POST signup', async () => {
    it('it should Register, Login, and check token', async () => {
      const res = await chai.request(server).post('/signup')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(201)
    })
  })

  describe('/POST login', async () => {
    it('Log in the previous user and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })
  })

  describe('/GET logout', async () => {
    it('Logout the user', async () => {
      const res = await chai.request(server).get('/logout')
        .set('content-type', 'application/json')
        .set('token', token)
        .send(adminInfo)
      expect(res.status).to.equal(200)
    })
  })

})
