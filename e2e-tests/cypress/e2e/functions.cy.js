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

    it('download function', () => {
        cy.openDrawer('function');
        cy.getDataCy('download-button').click({ force: true });
        cy.get('[data-filename]')
            .invoke('data', 'filename')
            .then((filename) => cy.checkDownloadedFile(filename));
    });

    // WIP - not working
    it.skip('copy function key', () => {
        cy.openDrawer('function');
        // cy.getDataCy('function-key').invoke('text').as('key');
        cy.getDataCy('copy-function-key')
            .click()
            .invoke('attr', 'value')
            .then((value) => {
                cy.checkValueCopiedToClipboard(value);
            });
    });
});
