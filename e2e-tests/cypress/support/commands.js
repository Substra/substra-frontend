// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// get the data-cy attribute
Cypress.Commands.add('getDataCy', (input) => {
    return cy.get(`[data-cy='${input}']`);
});

/**
 * Login to the app using credentials in cypress env,
 * then check if cookies have been set correctly.
 */
Cypress.Commands.add('login', () => {
    cy.session(
        'login',
        () => {
            cy.visit('/login');
            cy.get('input[type=text]').type(Cypress.env('USERNAME'));
            cy.get('input[type=password').type(Cypress.env('PASSWORD'));
            cy.get('button[type=submit]').click();
            cy.url().should('include', '/compute_plans');
        },
        {
            validate: () => {
                cy.getCookie('refresh').should('not.be.null');
                cy.getCookie('signature').should('not.be.null');
                cy.getCookie('header.payload').should('not.be.null');
            },
            cacheAcrossSpecs: true,
        }
    );
});

/**
 * Check the item count to see if there is several pages.
 * If there is, test to go back & forth between page 1 & 2.
 * First using next & previous buttons,then using number buttons.
 */
Cypress.Commands.add('paginationTest', () => {
    cy.getDataCy('items-count').then(($count) => {
        const count = parseInt($count.text());
        if (count > Cypress.env('DEFAULT_PAGE_SIZE')) {
            cy.getDataCy('active-page').invoke('text').should('eq', '1');
            cy.getDataCy('next-page').click();
            cy.getDataCy('active-page').invoke('text').should('eq', '2');
            cy.getDataCy('previous-page').click();
            cy.getDataCy('active-page').invoke('text').should('eq', '1');
            cy.getDataCy('second-page').click();
            cy.getDataCy('active-page').invoke('text').should('eq', '2');
        }
    });
});

/**
 * Check the opening and closing of the filter modal.
 * First by clicking the add filter button,
 * then by clicking the filter button inside table column header menus
 */
Cypress.Commands.add('checkOpenFilters', (position) => {
    cy.getDataCy('filters-table').should('not.exist');
    cy.getDataCy('add-filter').click();
    cy.getDataCy('filters-table').should('exist');
    cy.getDataCy('close-filters-modal').click();
    cy.getDataCy('filters-table').should('not.be.visible');
    cy.getDataCy('th-menu-button').eq(position).click();
    cy.getDataCy('open-filters').first().click();
    cy.getDataCy('filters-table').should('be.visible');
});

/**
 * Check if an asset table can be filtered by a given filter.
 * filter - expects the name of the filter to test as a string
 */
Cypress.Commands.add('checkFilterAssetsBy', (filter) => {
    cy.getDataCy('add-filter').click();
    cy.getDataCy(`${filter}-filters`).click();
    cy.get('[data-cy="filter-checkbox"] > input')
        .first()
        .check({ force: true });
    cy.getDataCy('filters-apply').click();
    cy.getDataCy(`${filter}-filter-tag`).should('exist');
});

/**
 * Check if a drawer is correctly opened when clicking an asset in its table.
 */
Cypress.Commands.add('checkOpenDrawer', () => {
    cy.getDataCy('drawer').should('not.exist');
    cy.get('tbody[data-cy=loaded]').get('tr').eq(1).click({ force: true });
    cy.getDataCy('drawer').should('exist');
});

/**
 * Check if a file of a given name has been correctly downloaded.
 * filename - expects the filename as a string
 */
Cypress.Commands.add('checkDownloadedFile', (filename) => {
    cy.readFile(`cypress/downloads/${filename}`, { timeout: 20000 });
});

// WIP - not working
Cypress.Commands.add('checkValueCopiedToClipboard', (value) => {
    cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
            expect(text).to.eq(value);
        });
    });
});
