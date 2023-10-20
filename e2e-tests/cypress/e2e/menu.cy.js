describe('Menu tests', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/compute_plans');
        cy.getDataCy('menu-button').click();
    });

    it('help and feedback modal', () => {
        cy.getDataCy('help]').click();
        cy.getDataCy('help-modal').should('exist');
    });

    it('about modal', () => {
        cy.getDataCy('about').click();
        cy.getDataCy('about-modal').should('exist');
    });

    it('documentation link', () => {
        cy.getDataCy('documentation')
            .should('have.attr', 'href', 'https://docs.substra.org/')
            .should('have.attr', 'target', '_blank');
    });

    it('api tokens page', () => {
        cy.getDataCy('api-tokens').click();
        cy.url().should('include', '/manage_tokens');
    });

    it('users management page', () => {
        cy.get('[data-user-role]')
            .invoke('data', 'user-role')
            .then((userRole) => {
                if (userRole === 'ADMIN') {
                    cy.getDataCy('users-management').click();
                    cy.url().should('include', '/users');
                }
            });
    });

    it('logout button', () => {
        cy.getDataCy('logout').click();
        cy.url().should('include', '/login');
    });
});
