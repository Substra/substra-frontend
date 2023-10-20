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

    it('opens filters', () => {
        cy.checkOpenFilters(0);
    });

    it('can filter datasets by owner', () => {
        cy.checkFilterAssetsBy('owner');
    });

    it('navigates to the dedicated dataset page', () => {
        cy.get('tbody[data-cy=loaded]').get('tr').eq(1).click({ force: true });
        cy.url().should('match', /datasets\/.{36}/);
    });
});
