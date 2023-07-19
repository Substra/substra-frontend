/// <reference types="Cypress" />

describe('Functions page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.intercept(
            'GET',
            `${Cypress.env('BACKEND_API_URL')}/function/?page_size=*`
        ).as('functions');
        cy.visit('/functions');
        cy.wait('@functions');
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
        cy.checkOpenFilters();
    });

    it('display a function drawer', () => {
        cy.checkOpenDrawer('function');
    });

    it.only('copy function key', () => {
        cy.openDrawer('function');
        // cy.getDataCy('function-key').invoke('text').as('key');
        cy.getDataCy('copy-function-key')
            .click()
            .invoke('attr', 'value')
            .then((value) => {
                cy.checkValueCopiedToClipboard(value);
            });
        // cy.getDataCy('function-key').should(($functionKey) => {
        //     const key = $functionKey.text();
        //     cy.checkValueCopiedToClipboard(key);
        // });
    });
});
