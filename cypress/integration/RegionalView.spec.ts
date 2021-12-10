describe('<RegionalView />', () => {
    it('Displays map and legend', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/regional/latest.json',
            { fixture: 'regionalData.json' },
        ).as('fetchRegionalData');

        cy.visit('/region');

        cy.wait('@fetchRegionalData');

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains('Cases').should('be.visible');
    });
});
