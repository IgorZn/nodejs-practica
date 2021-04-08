const { username, password } = Cypress.env('credentials');

describe('Email', function () {

    beforeEach('Email flow', () => {
        // repetitive code
        // for example login
    })

    it('Can get user\'s  token by username', function () {
        cy.task('getUserToken', {username: username}).then(() => {
            cy.wrap(username).should('have.length', 4);
        })
    })


});