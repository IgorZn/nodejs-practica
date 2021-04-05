const { username, password } = Cypress.env('credentials');

describe('Email', function () {

    beforeEach('Email flow', () => {
        // repetitive code
        // for example login
    })

    it('Can not drop by not exist email', function () {
        cy.visit('/auth/login#login');
        cy.get('a').contains('Забыли пароль?').click();
        cy.get('input#email').type('lala-land@goo.com', {force: true});
        cy.get('button').contains('Сбросить').click();
        cy.get('.alert').should('contain', 'Пользователя с таким адресом не зарегестрированно.');

    });

    it('Redirect to login form if email exist', function () {
        cy.visit('/auth/login#login');
        cy.get('a').contains('Забыли пароль?').click();
        cy.get('input#email').type(username, {force: true});
        cy.get('button').contains('Сбросить').click();
        cy.location().should((location) => {
          expect(location.pathname).to.eq('/auth/login')
          expect(location.protocol).to.eq('http:')
        });

    });

    it('Can drop password by email', function () {
        cy.visit('/auth/login#login');
        cy.get('a').contains('Забыли пароль?').click();
        cy.get('input#email').type(username, {force: true});
        cy.get('button').contains('Сбросить').click();
    })


});