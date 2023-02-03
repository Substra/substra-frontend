/// <reference types="Cypress" />

describe('Functions page', () => {
    it('lists functions', () => {
        cy.visit('/functions');
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('displays an function drawer', () => {
        cy.visit('/functions');
        cy.get('[data-cy=drawer]').should('not.exist');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.get('[data-cy=drawer]').should('exist');
    });
});
