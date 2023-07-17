/// <reference types="Cypress" />

describe('Datasets page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/datasets');
    });

    it('lists datasets', () => {
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('navigates to the dedicated dataset page', () => {
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.url().should('match', /datasets\/.{36}/);
    });
});
