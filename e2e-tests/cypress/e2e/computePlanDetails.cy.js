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

    it('navigates to the Workflow page', () => {
        cy.getDataCy('Workflow-tab').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/workflow/);
        cy.getDataCy('workflow-graph').should('exist');
    });

    it('navigates back to the Detail page', () => {
        cy.getDataCy('Details-tab').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/tasks/);
    });

    it('navigates to the Performance page', () => {
        cy.getDataCy('Performances-tab').click({ force: true });
        cy.url().should('match', /compute_plans\/.{36}\/chart/);
        cy.getDataCy('cp-chart').should('exist');
    });

    it('clicks on perf card to display perf details', () => {
        // cy.visit('/compute_plans/bb41f602-d644-4191-bec4-3c3f5ccb3d96/tasks/'); // SHOULD NOT HAVE TO DEPEND ON THIS
        cy.getDataCy('Performances-tab').click({ force: true });
        cy.getDataCy('perf-list').should('exist');
        cy.getDataCy('perf-card').first().click();
        cy.getDataCy('perf-details').should('exist');
    });

    it('can download perf details as jpeg or csv', () => {
        // cy.visit('/compute_plans/bb41f602-d644-4191-bec4-3c3f5ccb3d96/tasks/'); // SHOULD NOT HAVE TO DEPEND ON THIS
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
