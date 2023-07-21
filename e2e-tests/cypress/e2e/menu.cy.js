describe('Menu tests', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/compute_plans');
        cy.get('[data-cy=menu-button]').click();
    });

    it('help and feedback modal', () => {
        cy.get('[data-cy=help]').click();
        cy.get('[data-cy=help-modal]').should('exist');
    });

    it('about modal', () => {
        cy.get('[data-cy=about]').click();
        cy.get('[data-cy=about-modal]').should('exist');
    });

    it('documentation link', () => {
        cy.get('[data-cy=documentation]')
            .should('have.attr', 'href', 'https://docs.substra.org/')
            .should('have.attr', 'target', '_blank');
    });

    it('api tokens page', () => {
        cy.get('[data-cy=api-tokens]').click();
        cy.url().should('include', '/manage_tokens');
    });

    it('logout button', () => {
        cy.get('[data-cy=logout]').click();
        cy.url().should('include', '/login');
    });
});
