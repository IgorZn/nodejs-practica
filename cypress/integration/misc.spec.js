const { username, password } = Cypress.env('credentials');

describe('Misc', function () {

    beforeEach('Various tests', () => {
        // repetitive code
        // for example login
    })

    it('Custom 404 error', function () {
        cy.visit('/auth/boo', {failOnStatusCode: false});
        cy.get('h1').should('contain','404 Ошибка')
        cy.get('p').should('contain','Страница не найдена')
        cy.get('a').contains('На главную').click();
        cy.hash().should('eq', '');

    });




});