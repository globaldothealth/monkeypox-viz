describe('<ChartView />', () => {
    beforeEach(() => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json', statusCode: 200 },
        ).as('fetchCountriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries/country_confirmed.json',
            { fixture: 'timeseriesCountryData.json', statusCode: 200 },
        ).as('fetchTimeseriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries/confirmed.json',
            { fixture: 'timeseriesTotalData.json', statusCode: 200 },
        ).as('fetchTimeseriesCountData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/total/latest.json',
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

        cy.contains('Chart View').click();
    });

    it('Displays chart and slider', () => {
        cy.contains(/Total confirmed cases: worldwide/);
        cy.contains(/Current date period:/i);
        cy.get('svg.recharts-surface').should('be.visible');
    });

    it("Doesn't show confrimed and confirmed and suspected buttons in the Sidebar", () => {
        cy.get('button')
            .contains(/confirmed/i)
            .should('not.exist');
        cy.get('button')
            .contains(/confirmed and suspected/i)
            .should('not.exist');
    });

    it('Can select specific countries from the Sidebar', () => {
        cy.contains(/Total confirmed cases: worldwide/i);

        cy.get('button').contains(/spain/i).click();

        cy.contains(/Total confirmed cases: worldwide/i).should('not.exist');
        cy.contains(/Total confirmed cases: spain/i);
    });
});
