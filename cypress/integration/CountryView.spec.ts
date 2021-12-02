describe('<CountryView />', () => {
    it('Displays map and legend', () => {
        cy.visit('/');

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains('Line List Cases').should('be.visible');
    });
});
