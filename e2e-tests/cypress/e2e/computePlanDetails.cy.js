/// <reference types="Cypress" />

describe('Compute plans page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/compute_plans');
        cy.get('tbody[data-cy=loaded]').get('tr').eq(1).click({ force: true });
    });

    it('navigates to the dedicated compute plan page', () => {
        cy.url().should('match', /compute_plans\/.{36}\/tasks/);
    });

    it('adds cp to favorites', () => {
        cy.getDataCy('favorite-cp').should('not.exist');
        cy.getDataCy('favorite-box').first().click();
        cy.getDataCy('favorite-cp').should('exist');
    });

    it('task drawer shows performance', () => {
        cy.getDataCy('task-with-performance')
            .should('have.length.gte', 0)
            .then(($hits) => {
                if ($hits.length > 0) {
                    cy.getDataCy('task-with-performance').first().click();
                    cy.getDataCy('output-performance').should('exist');
                }
            });
    });

    it('navigates to the Workflow page', () => {
        cy.getDataCy('Workflow-tab').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/workflow/);
        cy.getDataCy('workflow-graph').should('exist');
    });

    it('navigates to the Detail page', () => {
        cy.getDataCy('Details-tab').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/tasks/);
    });

    it('navigates to the Performance page', () => {
        cy.getDataCy('Performances-tab').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/chart/);
        cy.getDataCy('cp-chart').should('exist');
    });

    it('clicks on perf card to display perf details', () => {
        cy.getDataCy('Performances-tab').click({ force: true });
        cy.getDataCy('perf-list').should('exist');
        cy.getDataCy('perf-card').first().click();
        cy.getDataCy('perf-details').should('exist');
    });

    it('can download perf details as jpeg or csv', () => {
        cy.getDataCy('Performances-tab').click({ force: true });
        cy.getDataCy('perf-card').first().click();
        cy.get('[data-cpkey]')
            .invoke('data', 'cpkey')
            .then((key) => {
                cy.getDataCy('download-button').click();
                cy.getDataCy('download-as-jpeg').click();
                cy.checkDownloadedFile(`cp_${key}.jpeg`);
                cy.getDataCy('download-button').click();
                cy.getDataCy('download-as-csv').click();
                cy.checkDownloadedFile(`${key}.csv`);
            });
    });
});
