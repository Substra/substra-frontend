/// <reference types="Cypress" />

describe('Login page', () => {
    beforeEach(() => {
        cy.request('GET', `${Cypress.env('BACKEND_API_URL')}/user/logout`);
    });

    it('redirects to /login automatically', () => {
        cy.visit('/');
        cy.url().should('include', '/login');
    });

    it('displays error message for bad login/password', () => {
        cy.visit('/login');
        cy.get('input[type=text]').type('foo');
        cy.get('input[type=password').type('bar');
        cy.get('button[type=submit]').click();
        cy.contains('No active account found with the given credentials');
    });

    it('has cookies when login is successful', () => {
        // proper login
        cy.visit('/login');
        cy.get('input[type=text]').type(Cypress.env('USERNAME'));
        cy.get('input[type=password').type(Cypress.env('PASSWORD'));
        cy.get('button[type=submit]').click();

        // should be redirects to datasets pages
        cy.url().should('include', '/datasets');

        // should have cookies
        cy.getCookie('refresh').should('not.be.null');
        cy.getCookie('signature').should('not.be.null');
        cy.getCookie('header.payload').should('not.be.null');
    });
});
