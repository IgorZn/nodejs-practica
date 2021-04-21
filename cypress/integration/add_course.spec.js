const { username, password } = Cypress.env('credentials');

describe('Add course validations', function () {
    beforeEach('Log In', () => {
        cy.fixture('user.json').then(users =>{
            cy.task('logIn',{username: users.username, password: users.password})
        })

    })

    it('Can not enter name less then 3 symbols', function () {


    });

})