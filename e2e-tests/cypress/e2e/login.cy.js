/// <reference types="Cypress" />

describe('Login page', () => {
    beforeEach(() => {
        cy.request('GET', `${Cypress.env('BACKEND_API_URL')}/me/logout`);
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
        cy.login();
    });
});
