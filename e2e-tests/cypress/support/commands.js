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

Cypress.Commands.add('getDataCy', (input) => {
    return cy.get(`[data-cy='${input}']`);
});

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

Cypress.Commands.add('openFilters', () => {
    cy.getDataCy('open-filters').click();
});

Cypress.Commands.add('checkOpenFilters', () => {
    cy.openFilters();
    cy.getDataCy('filters-table').should('exist');
});

Cypress.Commands.add('openDrawer', (route) => {
    cy.intercept('GET', `${Cypress.env('BACKEND_API_URL')}/${route}/*/`).as(
        'drawer'
    );
    cy.get('tbody[data-cy=loaded]').get('tr').eq(2).click({ force: true });
    cy.wait('@drawer');
});

Cypress.Commands.add('checkOpenDrawer', (route) => {
    cy.getDataCy('drawer').should('not.exist');
    cy.openDrawer(route);
    cy.getDataCy('drawer').should('exist');
});

Cypress.Commands.add('checkValueCopiedToClipboard', (value) => {
    cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
            expect(text).to.eq(value);
        });
    });
});
