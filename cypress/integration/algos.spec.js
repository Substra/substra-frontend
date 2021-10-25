/// <reference types="Cypress" />

describe('Algos page', () => {
    it('lists algos', () => {
        cy.visit('/algorithms');
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('displays an algo drawer', () => {
        cy.visit('/algorithms');
        cy.get('[data-cy=drawer]').should('not.exist');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.get('[data-cy=drawer]').should('exist');
    });
});
