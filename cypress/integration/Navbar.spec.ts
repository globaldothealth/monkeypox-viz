describe('<TopBar />', () => {
    it('Displays navbar and logo', () => {
        cy.visit('/');

        cy.url().should('include', '/country');

        cy.get('.navbar').should('be.visible');
        cy.get('#logo').should('be.visible');
        cy.contains('Country view').should('be.visible');
        cy.contains('Regional view').should('be.visible');
        cy.contains('Coverage').should('be.visible');

        cy.url().should('include', '/country');

        cy.get('.regionalViewNavButton').click();
        cy.url().should('include', '/region');
        cy.url().should('not.include', '/country');
    });
});
