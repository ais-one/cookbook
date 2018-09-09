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

let userInfo = {
  email: 'user@user.com',
  password: '123456'
}

let token = ''
// let adminUser = null

if (0) describe('Login as admin, Create normal user, Increase Resource Count, List Users, List User, Delete normal user', async () => {
  // it.only("Does Nothing", () => { })

  await describe('/POST login', async () => {
    it('Log in as admin user and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })
  })

  if (0) await describe('/POST user', async () => {
    it('Admin create normal user', async () => {
      const res = await chai.request(server).post('/user')
        .set('content-type', 'application/json').set('token', token)
        .send(userInfo)
      expect(res.status).to.equal(201)
    })
  })

  if (0) await describe('/PUT user/id', async () => {
    it('Admin update normal user', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).put('/user/' + normalUser.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 2})
      expect(res.status).to.equal(200)
    })
  })

  if (1) await describe('/DELETE user/id', async () => {
    it('Admin delete normal user', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).delete('/user/' + normalUser.uid)
        .set('content-type', 'application/json').set('token', token)
        .send()
      expect(res.status).to.equal(200)
    })
  })
})
