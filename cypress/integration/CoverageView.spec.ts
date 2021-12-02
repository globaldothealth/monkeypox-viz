describe('<CoverageView />', () => {
    it('Displays map and legend', () => {
        cy.visit('/coverage');

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains('Coverage').should('be.visible');
    });
});
