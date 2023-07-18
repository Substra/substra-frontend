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

Cypress.Commands.add('pagination_test', () => {
    cy.get('[data-cy=items-count]').then(($count) => {
        const count = parseInt($count.text());
        if (count > Cypress.env('DEFAULT_PAGE_SIZE')) {
            cy.get('[data-cy=active-page').invoke('text').should('eq', '1');
            cy.get('[data-cy=next-page]').click();
            cy.get('[data-cy=active-page').invoke('text').should('eq', '2');
            cy.get('[data-cy=previous-page]').click();
            cy.get('[data-cy=active-page').invoke('text').should('eq', '1');
            cy.get('[data-cy=second-page]').click();
            cy.get('[data-cy=active-page').invoke('text').should('eq', '2');
        }
    });
});

Cypress.Commands.add('open_filters', () => {
    cy.get('[data-cy=open-filters]').click();
    cy.get('[data-cy=filters-table]').should('exist');
});
