/// <reference types="Cypress" />

describe('Compute plans page', () => {
    it('lists compute plans', () => {
        cy.visit('/compute_plans');
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('navigates to the dedicated compute plan page', () => {
        cy.visit('/compute_plans');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/tasks/);
    });
});
