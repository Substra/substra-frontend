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

    it('navigates to the Workflow page', () => {
        cy.visit('/compute_plans');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.get('[data-cy=Workflow-tab]').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/workflow/);
        cy.get('[data-cy=workflow-graph]').should('exist');
    });

    it('navigates back to the Detail page', () => {
        cy.visit('/compute_plans');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.get('[data-cy=Details-tab]').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/tasks/);
    });

    it('navigates to the Performance page', () => {
        cy.visit('/compute_plans');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.get('[data-cy=Performances-tab]').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/chart/);
        cy.get('[data-cy=cp-chart]').should('exist');
    });
});
