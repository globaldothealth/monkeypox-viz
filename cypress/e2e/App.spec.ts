describe('<App />', () => {
    it('Shows loading indicator while fetching data', () => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country-who/latest.json',
            { fixture: 'countriesData.json', statusCode: 200 },
        ).as('fetchCountriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries-who/country_confirmed.json',
            {
                fixture: 'timeseriesCountryData.json',
                statusCode: 200,
            },
        ).as('fetchTimeseriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries-who/confirmed.json',
            {
                fixture: 'timeseriesTotalData.json',
                statusCode: 200,
            },
        ).as('fetchTimeseriesCountData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/total-who/latest.json',
            { fixture: 'totalCasesData.json', statusCode: 200 },
        ).as('fetchTotalCasesData');

        cy.visit('/');

        cy.get('.MuiCircularProgress-root')
            .should('exist')
            .should('be.visible');

        cy.wait(
            [
                '@fetchCountriesData',
                '@fetchTotalCasesData',
                '@fetchTimeseriesData',
                '@fetchTimeseriesCountData',
            ],
            { timeout: 15000 },
        );

        cy.get('.MuiCircularProgress-root').should('not.exist');
    });

    it('Shows error alert when fetching fails', () => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country-who/latest.json',
            { statusCode: 403 },
        ).as('fetchCountriesData');

        cy.visit('/');

        cy.wait('@fetchCountriesData');

        cy.contains('Error').should('be.visible');
        cy.contains('Fetching countries data failed').should('be.visible');
    });

    it('Displays Navbar items', () => {
        cy.visit('/');

        cy.contains(/Country view/i).should('be.visible');
        cy.contains(/Monkeypox Dataset/i).should('be.visible');
        cy.contains(/Feedback/i).should('be.visible');
        cy.contains(/Briefing Report/i).should('be.visible');
    });

    it('Navigates to different views', () => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country-who/latest.json',
            { fixture: 'countriesData.json' },
        ).as('fetchCountriesData');

        cy.visit('/');
        cy.wait('@fetchCountriesData');

        cy.contains(/Country view/i).click();
        cy.contains(/Line List Cases/i).should('be.visible');
        cy.url().should('eq', 'http://localhost:3000/country');

        cy.contains(/Monkeypox Dataset/i)
            .should('have.attr', 'href')
            .and('eq', 'https://github.com/globaldothealth/monkeypox');

        cy.contains(/Briefing Report/i)
            .should('have.attr', 'href')
            .and('eq', 'https://www.monkeypox.global.health');

        cy.contains(/Feedback/i)
            .should('have.attr', 'href')
            .and(
                'eq',
                'mailto:info@global.health?subject=Feedback regarding Global.health map',
            );
    });
});
