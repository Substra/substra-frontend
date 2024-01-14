describe('Users page', () => {
    before(() => {
        cy.login();
    });

    beforeEach(() => {
        cy.visit('/compute_plans');
        cy.getDataCy('menu-button').click();
        cy.get('[data-user-role]')
            .invoke('data', 'user-role')
            .then((userRole) => {
                if (userRole === 'ADMIN') {
                    cy.visit('/users');
                }
            });
    });

    it('can create user', () => {
        cy.getDataCy('create-user').click();
        cy.getDataCy('username-input').type('Test');
        cy.getDataCy('password-input').type('Azertyuiop123456789$');
        cy.getDataCy('submit-form').click();

        cy.get('[data-name="Test"]').first().should('exist');
    });

    it('can update user', () => {
        cy.get('[data-name="Test"]')
            .first()
            .should('exist')
            .then(($el) => {
                cy.wrap($el).should('have.data', 'role', 'USER');
                cy.wrap($el).click();
            });
        cy.get('select').eq(0).select('ADMIN');
        cy.getDataCy('submit-form').click();

        cy.get('[data-name="Test"]')
            .first()
            .then(($el) => {
                cy.wrap($el).should('have.data', 'role', 'ADMIN');
            });
    });

    it('can delete user', () => {
        cy.get('[data-name="Test"]').first().click();
        cy.getDataCy('delete-user').click();
        cy.getDataCy('confirm-delete').click();
        cy.get('[data-name="Test"]').should('not.exist');
    });
});
