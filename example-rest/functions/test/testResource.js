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
let resourceUid = '' // resource user id (used only when admin create/delete, need to see this resource for user)
let resources = []

if (0) describe('Create / Remove resouces', async () => {
  // it.only("Does Nothing", () => { })

  before(async () => { // get uid of non admin user
    try {
      const user = await auth.getUserByEmail(userInfo.email)
      resourceUid = user.uid
    } catch (e) { }
  })

  await describe('/POST login', async () => {
    it('Log in as normal user and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })
  })

  if (1) await describe('/POST resource', async () => {
    it('Add resource as user', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: resourceUid})
      expect(res.status).to.equal(201)
    })
    it('Add another resource as user', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: resourceUid})
      expect(res.status).to.equal(201)
    })
  })

  if (0) await describe('/GET resource', async () => {
    it('List resource as user', async () => {
      const res = await chai.request(server).get('/resource/')
        .set('content-type', 'application/json').set('token', token)
        .send()
      expect(res.status).to.equal(200)
      resources = res.body
    })
  })

  if (0) await describe('/DELETE resource/id', async () => {
    it('Delete resource as user', async () => {
      const id = resources[0].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token)
        .send()
      expect(res.status).to.equal(200)
    })
    it('Delete another resource as user', async () => {
      const id = resources[1].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token)
        .send()
      expect(res.status).to.equal(200)
    })
  })

  console.log('done...........')
})
