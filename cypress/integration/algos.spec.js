/// <reference types="Cypress" />

describe('Algos page', () => {
    it('lists algos', () => {
        cy.visit('/algorithms');
        cy.get('tbody').contains('MyOrg1MSP');
    });

    it('displays an algo sider', () => {
        cy.visit('/algorithms');
        cy.contains('Algorithm details').should('not.be.visible');
        cy.get('tbody').contains('MyOrg1MSP').click({ force: true });
        cy.contains('Algorithm details').should('be.visible');
    });
});
