describe('<SideBar />', () => {
    it('Displays navbar, hides navbar', () => {
        cy.visit('/');

        cy.get('.sidebar').should('be.visible');

        cy.contains('Updated');
        cy.contains('COVID-19 LINE LIST CASES');
        cy.get('#sidebar-tab-icon').should('be.visible').click();

        cy.contains('Updated').should('not.be.visible');
        cy.contains('COVID-19 LINE LIST CASES').should('not.be.visible');

        cy.get('#sidebar-tab-icon').click();

        cy.get('.regionalViewNavButton').click();
        cy.get('.sidebar').should('be.visible');
    });

    it('Countries list dropdown opens', () => {
        cy.visit('/');

        cy.get('.searchbar')
            .should('be.visible')
            .click()
            .type('Germany{downarrow}{enter}');

        //TODO: add action to check if germany was clicked correctly (ie. zoom into the right country)
    });
});
