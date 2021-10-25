/// <reference types="Cypress" />

describe('Tasks page', () => {
    it('lists tasks', () => {
        cy.visit('/tasks');
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('displays a task drawer', () => {
        cy.visit('/tasks');
        cy.contains('Task details').should('not.be.visible');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.contains('Task details').should('be.visible');
    });
});
