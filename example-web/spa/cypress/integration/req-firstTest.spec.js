/// <reference types="cypress" />

// npx cypress open

describe('Test with backend', () => {
  beforeEach('login to app', () => {
    cy.server()
    cy.route('GET', '**/tags', 'fixture:tags.json')// .as('getTags') // cypress alias is a global variable
    cy.loginToApplication()
  })
  // it('should log in', () => {
  //   cy.log('Yes we are logged in')
  // })
  it.skip('verify correct req and res', () => {
    cy.server()
    cy.route('POST', '**/articles').as('postArticles') // cypress alis is a global variable

    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is a title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body of the Article')
    cy.contains('Publish Article').click()

    cy.wait('@postArticles')
    cy.get('@postArticles').then(xhr => {
      console.log(xhr)
      expect(xhr.status).to.equal(200)
      expect(xhr.request.body.article.body).to.equal('This is a body of the Article')
      expect(xhr.response.body.article.description).to.equal('This is a description')
    })
  })

  it.skip('should give tags with routing object', () => {
    cy.get('.tag-list')
      .should('contain', 'bbb')
      .and('contain', 'ccc')
      .and('contain', 'aaa')
  })
  it.skip('verify global feed likes count', () => {
    cy.route('GET', '**/articles/feed*', '{"articles": [], "articlesCount":0}')
    cy.route('GET', '**/articles*', 'fixture:articles.json')

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then( listOfButtons => {
      expect(listOfButtons[0]).to.contain('1')
      expect(listOfButtons[1]).to.contain('5')
    })

    cy.fixture('articles').then(file => {
      const articleLink = file.articles[1].slug
      cy.route('POST', '**/articles/' + articleLink +'/favorite', file)
    })
    cy.get('app-article-list button').eq(1).click()
      .should('contain', 6)    
  })

  it.only('delete a new article in a global feed', () => {
    const userCredentials = {
      user: {
        email: 'aaronxxx@gmail.com',
        password: '12345678'
      }
    }
    const bodyRequest = {
      article: {
        tagList: [],
        title: 'Request from API',
        description: 'API testing is easy',
        body: 'VueJS is cool'
      }
    }
    cy.get('@token').then(token => {
    // cy.request('POST', 'https://conduit.productionready.io/api/users/login', userCredentials)
    // .its('body').then(body => {
      // const token = body.user.token
      cy.request({
        url: 'https://conduit.productionready.io/api/articles/',
        headers: { 'Authorization' : 'Token '+token },
        method: 'POST',
        body: bodyRequest
      }).then( response => {
        expect(response.status).to.equal(200)
      })

      cy.contains('Global Feed').click()
      cy.get('.article-preview').first().click()
      cy.get('.article-actions').contains('Delete Article').click()

      cy.request({
        url: 'https://conduit.productionready.io/api/articles?limit=10&offset=0',
        headers: { 'Authorization' : 'Token '+token },
        method: 'GET'
      }).its('body').then( body => {

        expect(body.articles[0].title).not.to.equal('Request from API')
      })
    })
  })
})
