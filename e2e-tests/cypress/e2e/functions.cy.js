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
        cy.get('tbody[data-cy=loaded]').then(($body) => {
            if ($body.find('[data-cy="has-download-permissions"]').length) {
                cy.getDataCy('has-download-permissions')
                    .first()
                    .click({ force: true });
                cy.getDataCy('download-button').click({ force: true });
                cy.get('[data-fnkey]')
                    .invoke('data', 'fnkey')
                    .then((fnkey) => {
                        cy.intercept('GET', `/function/${fnkey}/file`).as(
                            'download'
                        );
                        cy.wait('@download');
                        cy.checkDownloadedFile(`function-${fnkey}.zip`);
                    });
            } else {
                cy.task(
                    'log',
                    'No function with download permissions available'
                );
            }
        });
    });
});
