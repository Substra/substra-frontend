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

    it.only('download function', () => {
        cy.get('tbody[data-cy=loaded]').then(($body) => {
            if ($body.find('[data-cy="has-download-permissions"]').length) {
                cy.getDataCy('has-download-permissions')
                    .first()
                    .click({ force: true });
                cy.getDataCy('download-button').click({ force: true });
                cy.get('[data-filename]')
                    .invoke('data', 'filename')
                    .then((filename) => cy.checkDownloadedFile(filename));
            } else {
                cy.task(
                    'log',
                    'No function with download permissions available'
                );
            }
        });
    });

    // WIP - not working
    it.skip('copy function key', () => {
        cy.get('tbody[data-cy=loaded]').get('tr').eq(1).click({ force: true });
        // cy.getDataCy('function-key').invoke('text').as('key');
        cy.getDataCy('copy-function-key')
            .click()
            .invoke('attr', 'value')
            .then((value) => {
                cy.checkValueCopiedToClipboard(value);
            });
    });
});
