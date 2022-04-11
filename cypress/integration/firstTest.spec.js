describe('Test with backend', () => {
    beforeEach('login to the app', () => {
        cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' })
        cy.loginToApplication()
    })

    it('Verify post request', () => {
        cy.intercept('POST', '**/articles').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body')
            expect(xhr.response.body.article.description).to.equal('This is a description')
        })
    })

    it('tags', () => {
        cy.get('.tag-list').should('contain', 'cypress')
            .and('contain', 'automation')
            .and('contain', 'testing')
    })

    it('articles', () => {

        cy.intercept('GET', '**/articles/feed*', { "articles": [], "articlesCount": 0 })
        cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })
        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(listOfButtons => {
            expect(listOfButtons[0]).to.contain('1')
            expect(listOfButtons[1]).to.contain('5')
        })

        cy.fixture('articles').then(file => {
            const articlelink = file.articles[1].slug
            cy.intercept('POST', '**/articles/' + articlelink + '/favorite', file)
        })
        cy.get('app-article-list button').eq(1).click()
            .should('contain', '6')
    })

    it('Intercepting and modifying the request & response', () => {
        // cy.intercept('POST', '**/articles', (req) => {
        //     req.body.article.description = "This is a description 2"
        // }).as('postArticles')

        cy.intercept('POST', '**/articles', (req) => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('This is a description')
                res.body.article.description = "This is a description 2"
            })
        }).as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title')
        cy.get('[formcontrolname="description"]').type('This is a description')
        cy.get('[formcontrolname="body"]').type('This is a body')
        cy.contains('Publish Article').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is a body')
            expect(xhr.response.body.article.description).to.equal('This is a description 2')
        })
    })

})