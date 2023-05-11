/// <reference types="Cypress" />

describe('Datasets page', () => {
    it('lists datasets', () => {
        cy.visit('/datasets');
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('navigates to the dedicated dataset page', () => {
        cy.visit('/datasets');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
        cy.url().should('match', /datasets\/.{36}/);
    });
});
