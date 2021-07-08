/// <reference types="Cypress" />

describe('Compute plans page', () => {
    it('lists compute plans', () => {
        cy.visit('/compute_plans');
        cy.get('tbody').contains('FAILED');
    });

    it('displays a compute plan sider', () => {
        cy.visit('/compute_plans');
        cy.contains('Compute plan details').should('not.be.visible');
        cy.get('tbody').contains('FAILED').click({ force: true });
        cy.contains('Compute plan details').should('be.visible');
    });
});
