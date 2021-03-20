/// <reference types="cypress" />

const logIn = () => {
    const { username, password } = Cypress.env('credentials');

    // Capture HTTP requests.
    cy.server();
    cy.route({
        method: 'POST',
        url: '**/api/log_in/**',
        status: 200,
        response: {
            'access': 'ACCESS_TOKEN',
            'refresh': 'REFRESH_TOKEN'
        }
    }).as('logIn');

    // Log into the app.
    cy.visit('/auth/login#login');
    cy.get('input#email').type(username, {force: true});
    cy.get('input#password').type(password, { log: false, force: true});
    cy.get('button').contains('Войти').click();
    // cy.wait('@logIn');
};
const getCSRF = () =>{
    return document.querySelector('input[name="_csrf"]').value
}

describe('Authentication', function () {

    describe('Another describe inside Authentication describe', function () {
        // This another block and it's stand alone block

        beforeEach('Code for every test', () => {
            // repetitive code
            // for example login
        })

        it.only('Can log in.', function () {
            cy.visit('/auth/login#login');
            cy.contains('div#login', 'Войти в магазин').then(loginForm => {
                const emailField = loginForm.find('label[for="email"]').text()
                const passField = loginForm.find('label[for="password"]').text()

                expect(emailField).to.equal('Email')
                expect(passField).to.equal('Пароль')
            });

        });

        it('Can sign up.', function () {
            cy.server();
            cy.route({
                method: 'POST',
                url: '**/auth/register/',
                status: 201,
                response: {
                    'id': 1,
                    'name': 'gary.cole@example.com',
                    'remail': 'Gary',
                    'last_name': 'Cole',
                    'group': 'driver',
                    'photo': '/media/images/photo.jpg'
                }
            }).as('signUp');

            cy.visit('/auth/login#login');
            cy.get('a').contains('Регистрация').click();
            cy.get('input#name').type('Gary', {force: true});
            cy.get('input#remail').type('moodak@example.com', {force: true});
            cy.get('input#rpassword').type('pAssw0rd', {log: false, force: true});
            cy.get('input#confirm').type('pAssw0rd', {log: false, force: true});

            cy.get('button').contains('Зарегистрироваться').click();
            // cy.wait('@signUp'); // new
            cy.hash().should('eq', '');
        });

    });

    beforeEach('Code for every test', () => {
        // repetitive code
        // for example login
    })

    it('Can log in.', function () {
        logIn();
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include(err.message)

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.hash().should('eq', '');

    });

    it('Can sign up.', function () {
        cy.server();
        cy.route({
            method: 'POST',
            url: '**/auth/register/',
            status: 201,
            response: {
                'id': 1,
                'name': 'gary.cole@example.com',
                'remail': 'Gary',
                'last_name': 'Cole',
                'group': 'driver',
                'photo': '/media/images/photo.jpg'
            }
        }).as('signUp');

        cy.visit('/auth/login#login');
        cy.get('a').contains('Регистрация').click();
        cy.get('input#name').type('Gary', {force: true});
        cy.get('input#remail').type('moodak@example.com', {force: true});
        cy.get('input#rpassword').type('pAssw0rd', {log: false, force: true});
        cy.get('input#confirm').type('pAssw0rd', {log: false, force: true});

        cy.get('button').contains('Зарегистрироваться').click();
        // cy.wait('@signUp'); // new
        cy.hash().should('eq', '');
    });

});