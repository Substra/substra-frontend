/// <reference types="Cypress" />

describe('Datasets page', () => {
    it('lists datasets', () => {
        cy.visit('/datasets');
        cy.get('tbody').contains('MyOrg1MSP');
    });

    it('displays a dataset sider', () => {
        cy.visit('/datasets');
        cy.contains('Dataset details').should('not.be.visible');
        cy.get('tbody').contains('MyOrg1MSP').click({ force: true });
        cy.contains('Dataset details').should('be.visible');
    });
});
