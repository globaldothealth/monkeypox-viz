describe('<Navbar />', () => {
    it('Displays navbar and logo', () => {
        cy.visit('/');

        cy.url().should('include', '/country');

        cy.get('.popup-small-screens').should('not.exist');

        cy.get('.navbar').should('be.visible');
        cy.get('#logo').should('be.visible');
        cy.contains('Country View').should('be.visible');
        cy.contains('Regional View').should('be.visible');
        cy.contains('Coverage View').should('be.visible');

        cy.url().should('include', '/country');

        cy.get('.regionalViewNavButton').click();
        cy.url().should('include', '/region');
        cy.url().should('not.include', '/country');
    });

    it('Opens and closes the MapGuide', () => {
        cy.visit('/');

        cy.get('.MuiDialog-paperScrollPaper').should('not.exist');
        cy.contains(/Map Guide/i)
            .should('be.visible')
            .click();
        cy.get('.MuiDialog-paperScrollPaper').should('exist');
        cy.get('[aria-label="close"]').click();
        cy.get('.MuiDialog-paperScrollPaper').should('not.exist');
        cy.contains(/Map Guide/i)
            .should('be.visible')
            .click();
        cy.get('body').click(0, 0);
        cy.get('.MuiDialog-paperScrollPaper').should('not.exist');
    });

    it('Displays popup on small devices', () => {
        cy.viewport(520, 780);
        cy.visit('/');

        cy.get('.popup-small-screens').contains(
            'For a better experience please visit this website using a device with a larger screen',
        );

        cy.get('.small-screens-popup-close-btn').click();
        cy.get('.popup-small-screens').should('not.exist');
    });
});
