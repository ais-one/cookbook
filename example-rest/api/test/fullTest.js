let chai = require('chai')
let expect = chai.expect
let should = chai.should()
let chaiHttp = require('chai-http')

let server = require('../index')

const {db, auth} = require('../firebase')

chai.use(chaiHttp);
 
let adminInfo = {
  email: 'admin@abc.com',
  password: '123456'
}
let adminInfo2 = {
  email: 'admin2@abc.com',
  password: '123456'
}
 
let userInfo = {
  email: 'user@abc.com',
  password: '123456'
}

let userInfo2 = {
  email: 'user2@abc.com',
  password: '123456'
}

let token = ''
let resourceUid = '' // resource user id (used only when admin create/delete, need to see this resource for user)
let resources = []
let users = []

let testAdminUser = false
let testAdminOnNormalUser = false
let testNormalUser = false
let populateDb = true

if (1) describe('Full end-to-end testing', async () => {

  // Clean up users and resouces first
  before(async () => { // not before each
    try {
      // reset admin user
      let docs, batch
      const adminUser = await auth.getUserByEmail(adminInfo.email)
      await auth.deleteUser(adminUser.uid)
      await db.collection('user').doc(adminUser.uid).delete()
      batch = db.batch()
      docs = await db.collection('resource').where('uid', '==', adminUser.uid).limit(500).get()
      docs.forEach(async (doc) => {
        await batch.delete( db.collection('resource').doc(doc.id) );
      })
      await batch.commit()
    } catch (e) { }
    try {
      // reset admin user 2
      let docs, batch
      const adminUser2 = await auth.getUserByEmail(adminInfo2.email)
      await auth.deleteUser(adminUser2.uid)
      await db.collection('user').doc(adminUser2.uid).delete()
      batch = db.batch()
      docs = await db.collection('resource').where('uid', '==', adminUser2.uid).limit(500).get()
      docs.forEach(async (doc) => {
        await batch.delete( db.collection('resource').doc(doc.id) );
      })
      await batch.commit()
    } catch (e) { }
    try {
      // reset normal user
      let docs, batch
      const normalUser = await auth.getUserByEmail(userInfo.email)
      await auth.deleteUser(normalUser.uid)
      await db.collection('user').doc(normalUser.uid).delete()
      batch = db.batch()
      docs = await db.collection('resource').where('uid', '==', normalUser.uid).limit(500).get()
      docs.forEach(async (doc) => {
        await batch.delete( db.collection('resource').doc(doc.id) );
      })
      await batch.commit()
    } catch (e) { }
  })

  if (testAdminUser) describe('Admim user testing', async () => {
    it('Log in as unregistered user - should fail', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(500)
    })

    it('Signup admin 1 user', async () => {
      const res = await chai.request(server).post('/signup')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(201)
    })

    it('Signup admin 2 user', async () => {
      const res = await chai.request(server).post('/signup')
        .set('content-type', 'application/json')
        .send(adminInfo2)
      expect(res.status).to.equal(201)
    })

    it('Log in as admin 1 and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })

    it('admin 1 update own quota from 0 to 2', async () => {
      const user = await auth.getUserByEmail(adminInfo.email)
      const res = await chai.request(server).put('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 2})
      expect(res.status).to.equal(200)
    })

    it('admin 1 update admin 2 quota - not allowed', async () => {
      const user = await auth.getUserByEmail(adminInfo2.email)
      const res = await chai.request(server).put('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 2})
      expect(res.status).to.equal(403)
    })

    it('admin 1 add own resource', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: null})
      expect(res.status).to.equal(201)
    })
    it('admin 1 another own resource', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: null})
      expect(res.status).to.equal(201)
    })
    it('admin 1 another own resource - over quota limit to 2 resource by trying to add a 3rd one', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: null})
      expect(res.status).to.equal(422)

    })
    it('admin 1 update self, reduce quota below current - fail', async () => {
      const user = await auth.getUserByEmail(adminInfo.email)
      const res = await chai.request(server).put('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 1})
      expect(res.status).to.equal(422)
    })

    it('admin 1 list own resources', async () => {
      const res = await chai.request(server).get('/resource/')
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
      resources = res.body
    })

    it('admin 1 delete own resource - 1 left', async () => {
      const id = resources[0].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
    })
    it('admin 1 delete own resource - 0 left', async () => {
      const id = resources[1].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
    })

    it('admin 1 delete ownself - not allowed', async () => {
      const user = await auth.getUserByEmail(adminInfo.email)
      const res = await chai.request(server).delete('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(403)
    })
    it('admin 1 delete admin 2 - not allowed', async () => {
      const user = await auth.getUserByEmail(adminInfo2.email)
      const res = await chai.request(server).delete('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(403)
    })

    it('logout admin 1 user', async () => {
      const res = await chai.request(server).get('/logout')
        .set('content-type', 'application/json')
        .set('token', token).send(adminInfo)
      token = ''
      expect(res.status).to.equal(200)
    })
  })

  if (testAdminOnNormalUser) describe('Admin performing operations on Normal User', async () => {
    // it.only("Does Nothing", () => { })

    it('Signup admin 1 user', async () => {
      const res = await chai.request(server).post('/signup')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(201)
    })

    it('Log in as admin 1 and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })

    it('admin 1 create normal user', async () => {
      const res = await chai.request(server).post('/user')
        .set('content-type', 'application/json').set('token', token).send(userInfo)
      expect(res.status).to.equal(201)
    })
    it('admin 1 update normal user', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).put('/user/' + normalUser.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 2})
      expect(res.status).to.equal(200)
    })
    it('admin 1 create duplicate normal user - should fail', async () => {
      const res = await chai.request(server).post('/user')
        .set('content-type', 'application/json').set('token', token).send(userInfo)
      expect(res.status).to.equal(500)
    })

    it('admin 1 list users', async () => {
      const res = await chai.request(server).get('/user')
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
      users = res.body
      expect(users.length).to.equal(2)
    })

    it('admin 1 add resource to normal user', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: normalUser.uid})
      expect(res.status).to.equal(201)
    })
    it('admin 1 add another resource to normal user', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: normalUser.uid})
      expect(res.status).to.equal(201)
    })
    it('admin 1 add another resource to normal user - over quota limit to 2 resource by trying to add a 3rd one', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: normalUser.uid})
      expect(res.status).to.equal(422)
    })

    it('admin 1 update normal user, reduce quota below current - fail', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).put('/user/' + normalUser.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 1})
      expect(res.status).to.equal(422)
    })

    it('admin 1 list resources', async () => {
      const res = await chai.request(server).get('/resource/')
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
      resources = res.body
      // console.log(resources)
    })

    it('admin 1 delete user resource - 1 left', async () => {
      const id = resources[0].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
    })
    it('admin 1 delete user resource - 0 left', async () => {
      const id = resources[1].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
    })

    it('admin 1 delete normal user', async () => {
      const user = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).delete('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
    })

    it('logout admin 1 user', async () => {
      const res = await chai.request(server).get('/logout')
        .set('content-type', 'application/json')
        .set('token', token).send(adminInfo)
      token = ''
      expect(res.status).to.equal(200)
    })

  })

  if (testNormalUser) describe('Normal User Operations', async () => {
    // it.only("Does Nothing", () => { })

    it('Signup admin 1 user', async () => {
      const res = await chai.request(server).post('/signup')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(201)
    })

    it('Log in as admin 1 and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })

    it('admin 1 create normal user', async () => {
      const res = await chai.request(server).post('/user')
        .set('content-type', 'application/json').set('token', token).send(userInfo)
      expect(res.status).to.equal(201)
    })

    it('logout admin 1 user', async () => {
      const res = await chai.request(server).get('/logout')
        .set('content-type', 'application/json')
        .set('token', token).send(adminInfo)
      token = ''
      expect(res.status).to.equal(200)
    })

    it('Log in as normal user and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(userInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })

    it('normal user update normal user', async () => {
      const normalUser = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).put('/user/' + normalUser.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 2})
      expect(res.status).to.equal(200)
    })

    it('normal user add own resource', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: null})
      expect(res.status).to.equal(201)
    })
    it('normal user another own resource', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: null})
      expect(res.status).to.equal(201)
    })
    it('normal user another own resource - over quota limit to 2 resource by trying to add a 3rd one', async () => {
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token)
        .send({uid: null})
      expect(res.status).to.equal(422)

    })

    it('normal list resources', async () => {
      const res = await chai.request(server).get('/resource/')
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
      resources = res.body
    })

    it('normal user delete user resource - 1 left', async () => {
      const id = resources[0].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
    })
    it('normal user delete user resource - 0 left', async () => {
      const id = resources[1].id
      const res = await chai.request(server).delete('/resource/' + id)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(200)
    })

    it('normal user create normal user - not allowed', async () => {
      const res = await chai.request(server).post('/user')
        .set('content-type', 'application/json').set('token', token).send(userInfo2)
      expect(res.status).to.equal(403)
    })

    it('normal user delete another user - not allowed', async () => {
      const user = await auth.getUserByEmail(adminInfo.email)
      const res = await chai.request(server).delete('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token).send()
      expect(res.status).to.equal(403)
    })

    it('normal user update another user - not allowed', async () => {
      const normalUser = await auth.getUserByEmail(adminInfo.email)
      const res = await chai.request(server).put('/user/' + normalUser.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 3})
      expect(res.status).to.equal(403)
    })

  })

  if (populateDb) describe('Populating Data on Firebase', async () => {
    it('Signup admin 1 user', async () => {
      const res = await chai.request(server).post('/signup')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(201)
    })

    it('Log in as admin 1 and obtain token', async () => {
      const res = await chai.request(server).post('/login')
        .set('content-type', 'application/json')
        .send(adminInfo)
      expect(res.status).to.equal(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })

    it('admin 1 create normal user', async () => {
      const res = await chai.request(server).post('/user')
        .set('content-type', 'application/json').set('token', token).send(userInfo)
      expect(res.status).to.equal(201)
    })

    it('admin 1 update normal user', async () => {
      const user = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).put('/user/' + user.uid)
        .set('content-type', 'application/json').set('token', token)
        .send({quotaAllocated: 3})
      expect(res.status).to.equal(200)
    })

    it('admin 1 add normal user resource', async () => {
      const user = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token).send({uid: user.uid})
      expect(res.status).to.equal(201)
    })
    it('admin 1 add normal user resource', async () => {
      const user = await auth.getUserByEmail(userInfo.email)
      const res = await chai.request(server).post('/resource')
        .set('content-type', 'application/json').set('token', token).send({uid: user.uid})
      expect(res.status).to.equal(201)
    })
  })

})