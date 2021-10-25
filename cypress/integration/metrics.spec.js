/// <reference types="Cypress" />

describe('Metrics page', () => {
    it('lists metrics', () => {
        cy.visit('/metrics');
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('displays a metric drawer', () => {
        cy.visit('/metrics');
        cy.get('[data-cy=drawer]').should('not.exist');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.get('[data-cy=drawer]').should('exist');
    });
});
