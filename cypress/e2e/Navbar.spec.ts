describe('<Navbar />', () => {
    it('Displays navbar and logo', () => {
        cy.visit('/');

        cy.url().should('include', '/country');

        cy.get('.popup-small-screens').should('not.exist');

        cy.get('.navbar').should('be.visible');
        cy.get('#logo').should('be.visible');
        cy.contains('Country View').should('be.visible');

        cy.url().should('include', '/country');
    });

    it('Opens and closes the MapGuide', () => {
        cy.visit('/');

        //hovering over button should display tooltip container
        cy.get('.MuiTooltip-tooltip').should('not.exist');
        cy.contains(/Map Guide/i)
            .should('be.visible')
            .trigger('mouseover');
        cy.get('.MuiTooltip-tooltip').should('exist');

        //hovering out of button should hide tooltip container
        cy.contains(/Map Guide/i)
            .should('be.visible')
            .trigger('mouseout');
        cy.get('.MuiTooltip-tooltip').should('not.exist');

        //repeating test for hovering out of tooltip container
        cy.contains(/Map Guide/i)
            .should('be.visible')
            .trigger('mouseover');
        cy.get('.MuiTooltip-tooltip').should('exist');
        // hovering out of tooltip container should hide it
        cy.get('.MuiTooltip-tooltip').trigger('mouseout');
        cy.get('.MuiTooltip-tooltip').should('not.exist');
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
