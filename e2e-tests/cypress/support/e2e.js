// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

beforeEach(() => {
    cy.request(
        'POST',
        `${Cypress.env('BACKEND_API_URL')}/me/login/?format=json`,
        {
            username: Cypress.env('USERNAME'),
            password: Cypress.env('PASSWORD'),
        }
    );

    /**
     * keep uncaught exceptions from failing tests
     * uncomment this function to test part with expected error
     **/
    // cy.on('uncaught:exception', (e, runnable) => {
    //     console.log('error', e);
    //     console.log('runnable', runnable);
    //     console.log('error', e.message);
    //     return false;
    // });
});
