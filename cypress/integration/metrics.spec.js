/// <reference types="Cypress" />

describe('Metrics page', () => {
    it('lists metrics', () => {
        cy.visit('/metrics');
        cy.get('tbody').contains('MyOrg1MSP');
    });

    it('displays a metric sider', () => {
        cy.visit('/metrics');
        cy.contains('Metric details').should('not.be.visible');
        cy.get('tbody').contains('MyOrg1MSP').click({ force: true });
        cy.contains('Metric details').should('be.visible');
    });
});
