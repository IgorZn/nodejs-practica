/// <reference types="cypress" />
const { username, password } = Cypress.env('credentials');

const logIn = (username=username, password=password) => {

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

    beforeEach('Code for every test', () => {
        // repetitive code
        // for example login
    })

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
        cy.get('input#remail').type(username, {force: true});
        cy.get('input#rpassword').type(password, {log: false, force: true});
        cy.get('input#confirm').type('pAssw0rd', {log: false, force: true});

        cy.get('button').contains('Зарегистрироваться').click();
        // cy.wait('@signUp'); // new
        cy.hash().should('eq', '');
    });

    it('Can log in.', function () {
        logIn('foo@foo', 'foo');
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

    it('Contains JQuery', function () {
            cy.visit('/auth/login#login');
            cy.contains('div#login', 'Войти в магазин').then(loginForm => {
                const emailField = loginForm.find('label[for="email"]').text()
                const passField = loginForm.find('label[for="password"]').text()

                expect(emailField).to.equal('Email')
                expect(passField).to.equal('Пароль')
            });

        });

    it('Добро пожаловать', function () {
        cy.visit('/');

        // 1
        cy.get('.container').should('contain', 'Добро пожаловать')

        // 2
        cy.get('.container').then( welcomeText => {
            expect(welcomeText.find('h2').text()).to.equal("Добро пожаловать")
        });

        // 3
        cy.get('.container').find('h2').invoke('text').then( text => {
            expect(text).to.equal("Добро пожаловать")
        })

        // 4
        cy.contains('nav','Главная')
            .find('li.active')
            // .click()
            // .find('li')
            .invoke('attr', 'class')
            .should('contain', 'active')

        });

    it('Check login form', function () {
        cy.visit('/auth/login#login');

        cy.contains('div','Войти в магазин')
            .then(enter => {
                cy.wrap(enter).invoke('prop', 'innerText')
                    .should('contain', "Email")
            })

        });

    it('Can NOT sign up if user exist.', function () {

        cy.visit('/auth/login#register');
        cy.get('a').contains('Регистрация').click();
        cy.get('input#name').type('Gary', {force: true});
        cy.get('input#remail').type('moodak@example.com', {force: true});
        cy.get('input#rpassword').type('pAssw0rd', {log: false, force: true});
        cy.get('input#confirm').type('pAssw0rd', {log: false, force: true});

        cy.get('button').contains('Зарегистрироваться').click();
        cy.get('.alert').should('contain', 'Пользователь с таким адресом уже существует');
        cy.location().should((location) => {
          expect(location.hash).to.eq('#register')
          expect(location.protocol).to.eq('http:')
        });

    });

    it('Can NOT log message if password is wrong', function () {
        // Log into the app.
        cy.visit('/auth/login#login');
        cy.get('input#email').type(username, {force: true});
        cy.get('input#password').type('password', { log: false, force: true});
        cy.get('button').contains('Войти').click();
        cy.get('.alert').should('contain', 'Логин или пароль введены не правильно');
        cy.location().should((location) => {
          expect(location.hash).to.eq('#login')
          expect(location.protocol).to.eq('http:')
        })

    });

    it('Can NOT register with wrong email', function () {
        cy.visit('/auth/login#register');
        cy.get('a').contains('Регистрация').click();
        cy.get('input#name').type('Gary', {force: true});
        cy.get('input#remail').type(username, {force: true});
        cy.get('input#rpassword').type(password, {log: false, force: true});
        cy.get('input#confirm').type(password, {log: false, force: true});

        cy.get('button').contains('Зарегистрироваться').click();
        cy.get('.alert').should('contain', 'Ты ахуел?');
        cy.location().should((location) => {
            expect(location.hash).to.eq('#register')
            expect(location.protocol).to.eq('http:')
        });

    });


});