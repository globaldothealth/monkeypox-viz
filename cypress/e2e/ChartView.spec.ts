describe('<ChartView />', () => {
    beforeEach(() => {
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
    });

    it('Displays chart and slider', () => {
        cy.contains('Chart View').click();

        cy.contains(/Total confirmed cases: Worldwide/);
        cy.contains(/Current date period:/i);
        cy.get('svg.recharts-surface').should('be.visible');
    });

    it("Doesn't show confrimed and confirmed and suspected buttons in the Sidebar", () => {
        cy.contains('Chart View').click();

        cy.get('button')
            .contains(/confirmed/i)
            .should('not.exist');
        cy.get('button')
            .contains(/confirmed and suspected/i)
            .should('not.exist');
    });

    it('Can select specific countries from the Sidebar', () => {
        cy.contains('Chart View').click();

        cy.contains(/Total confirmed cases: Worldwide/i);

        cy.wait(3000);

        cy.contains(/spain/i).click();

        cy.contains(/Total confirmed cases: worldwide/i).should('not.exist');
        cy.contains(/Total confirmed cases: spain/i);
    });

    it('Can switch to worldwide cases', () => {
        cy.contains('Chart View').click();
        cy.wait(3000);
        cy.contains('Spain').click();
        cy.contains('Total confirmed cases: Spain');

        cy.contains('Worldwide').click();
        cy.contains('Total confirmed cases: Spain').should('not.exist');
        cy.contains('Total confirmed cases: Worldwide');
    });
});
