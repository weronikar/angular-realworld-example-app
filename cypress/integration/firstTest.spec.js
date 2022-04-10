describe('Test with backend', () => {
    beforeEach('login to the app', () => {
        cy.loginToApplication()
    })

    it.only('login test', () => {
        cy.log('Should be logged in')
    })
})