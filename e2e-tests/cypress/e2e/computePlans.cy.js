/// <reference types="Cypress" />

describe('Compute plans page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/compute_plans');
    });

    it('lists compute plans', () => {
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 1);
    });

    it('displays tasks count bar in status/task column', () => {
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .eq(1)
            .within(() => {
                cy.getDataCy('cp-tasks-status')
                    .should('exist')
                    .trigger('mouseover');
                cy.getDataCy('cp-tasks-status-tooltip').should('be.visible');
            });
    });

    it('searches CP with a key', () => {
        cy.checkSearchByKey('compute_plans');
    });

    it('adds a cp to favorites', () => {
        cy.getDataCy('favorite-cp').should('not.exist');
        cy.getDataCy('favorite-box').first().click();
        cy.getDataCy('favorite-cp').should('exist');
    });

    it('selects/unselects cp in list', () => {
        cy.getDataCy('selection-popover').should('not.exist');
        cy.get('[data-cy="selection-box"]>input')
            .first()
            .check({ force: true });
        cy.getDataCy('selection-popover').should('exist');
        cy.get('[data-cy="selection-box"]>input')
            .first()
            .uncheck({ force: true });
        cy.getDataCy('selection-popover').should('not.exist');
    });

    it('opens filters', () => {
        cy.checkOpenFilters(1);
    });

    it('can filter cps by status', () => {
        cy.checkFilterAssetsBy('status');
    });
});
