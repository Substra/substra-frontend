/// <reference types="Cypress" />

describe('Tasks page', () => {
    it('lists tasks', () => {
        cy.visit('/tasks');
        cy.get('tbody').contains('MyOrg1MSP');
    });

    it('displays a task sider', () => {
        cy.visit('/tasks');
        cy.contains('Task details').should('not.be.visible');
        cy.get('tbody').contains('MyOrg1MSP').click({ force: true });
        cy.contains('Task details').should('be.visible');
    });
});
