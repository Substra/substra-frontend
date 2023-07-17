/// <reference types="Cypress" />

describe('Functions page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/functions');
    });

    it('lists functions', () => {
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('displays a function drawer', () => {
        cy.get('[data-cy=drawer]').should('not.exist');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.get('[data-cy=drawer]').should('exist');
    });
});
