/// <reference types="Cypress" />

describe('Functions page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/functions');
    });

    it('lists functions', () => {
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('functions pagination', () => {
        cy.paginationTest();
    });

    it('open filters', () => {
        cy.checkOpenFilters(0);
    });

    it('can filter functions by owner', () => {
        cy.checkFilterAssetsBy('owner');
    });

    it('display a function drawer', () => {
        cy.checkOpenDrawer();
    });
});
