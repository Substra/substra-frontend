/// <reference types="Cypress" />

describe('Tasks page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/tasks');
    });

    it('lists tasks', () => {
        cy.get('tbody[data-cy=loaded]')
            .get('tr')
            .should('have.length.greaterThan', 2);
    });

    it('functions pagination', () => {
        cy.paginationTest();
    });

    it('opens filters', () => {
        cy.checkOpenFilters(0);
    });

    it('can filter tasks by status', () => {
        cy.checkFilterAssetsBy('status');
    });

    it('displays a task drawer', () => {
        cy.checkOpenDrawer();
    });

    it('task drawer shows performance', () => {
        cy.getDataCy('task-with-performance').first().click();
        cy.getDataCy('output-performance').should('exist');
    });
});
