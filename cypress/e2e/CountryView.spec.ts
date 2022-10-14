describe('<CountryView />', () => {
    it('Displays map and legend', () => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country-who/latest.json',
            { fixture: 'countriesData.json', statusCode: 200 },
        ).as('fetchCountriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries-who/country_confirmed.json',
            { fixture: 'timeseriesCountryData.json', statusCode: 200 },
        ).as('fetchTimeseriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries-who/confirmed.json',
            { fixture: 'timeseriesTotalData.json', statusCode: 200 },
        ).as('fetchTimeseriesCountData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/total-who/latest.json',
            { fixture: 'totalCasesData.json', statusCode: 200 },
        ).as('fetchTotalCasesData');

        cy.visit('/');

        cy.wait(
            [
                '@fetchCountriesData',
                '@fetchTotalCasesData',
                '@fetchTimeseriesData',
                '@fetchTimeseriesCountData',
            ],
            { timeout: 15000 },
        );

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains('Confirmed Cases').should('be.visible');
    });
});
