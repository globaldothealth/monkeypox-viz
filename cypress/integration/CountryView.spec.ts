describe('<CountryView />', () => {
    it('Displays map and legend', () => {
        cy.visit('/');

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains('Line List Cases').should('be.visible');
    });

    it('Shows loading indicator while fetching data', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json' },
        ).as('fetchCountriesData');

        cy.visit('/');

        cy.contains('Loading...').should('exist').should('be.visible');

        cy.wait('@fetchCountriesData');

        cy.contains('Loading...').should('not.exist');
    });
});
