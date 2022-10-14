describe('<SideBar />', () => {
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
    });

    it('Displays navbar, hides navbar', () => {
        cy.visit('/');

        cy.get('[data-cy="sidebar"]').should('be.visible');

        cy.contains('MONKEYPOX LINE LIST CASES');
        cy.get('#sidebar-tab-icon').should('be.visible').click();

        cy.get('[data-cy="sidebar"]').should('not.be.visible');
        cy.contains('MONKEYPOX LINE LIST CASES').should('not.be.visible');

        cy.get('#sidebar-tab-icon').click();

        cy.get('[data-cy="sidebar"]').should('be.visible');
    });

    it('Displays loading skeleton while feetching data', () => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country-who/latest.json',
            { fixture: 'countriesData.json', statusCode: 200, delay: 3000 },
        ).as('fetchCountriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/total-who/latest.json',
            { fixture: 'totalCasesData.json', statusCode: 200, delay: 3000 },
        ).as('fetchTotalCasesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries-who/country_confirmed.json',
            {
                fixture: 'timeseriesCountryData.json',
                statusCode: 200,
                delay: 3000,
            },
        ).as('fetchTimeseriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/timeseries-who/confirmed.json',
            {
                fixture: 'timeseriesTotalData.json',
                statusCode: 200,
                delay: 3000,
            },
        ).as('fetchTimeseriesCountData');

        cy.visit('/');

        cy.get('[data-cy="loading-skeleton"]').should('have.length', 3);

        cy.wait(
            [
                '@fetchCountriesData',
                '@fetchTotalCasesData',
                '@fetchTimeseriesData',
                '@fetchTimeseriesCountData',
            ],
            { timeout: 15000 },
        );

        cy.get('[data-cy="loading-skeleton"]').should('not.exist');
        cy.contains(/Spain/i);
    });

    it('Countries list dropdown opens', () => {
        cy.visit('/');

        cy.get('.searchbar')
            .should('be.visible')
            .click()
            .type('Germany{downarrow}{enter}');
    });

    it('Updates value in autocomplete field after selecting country from the Sidebar', () => {
        cy.visit('/');

        cy.wait('@fetchCountriesData');
        cy.wait('@fetchTimeseriesData');
        cy.wait('@fetchTimeseriesCountData');
        cy.wait('@fetchTotalCasesData');

        cy.get('[data-cy="autocomplete-input"').should('have.value', '');
        const listedCountries = cy.get('[data-cy="listed-country"]');
        listedCountries.should('have.length.gte', 6);

        cy.contains(/Germany/i).click({ force: true });

        cy.get('[data-cy="autocomplete-input"').should('have.value', 'Germany');
    });

    it('Can switch between confirmed and combined views', () => {
        cy.visit('/');

        cy.wait('@fetchCountriesData');

        cy.contains(/Confirmed/i);
        cy.contains(/Confirmed and Suspected/i);

        cy.get('[data-cy="listed-country"]').first().contains('Worldwide');
        cy.get('[data-cy="listed-country"]').eq(1).contains('Spain');
        cy.get('[data-cy="listed-country"]').eq(2).contains('Portugal');

        cy.get('button')
            .contains(/Confirmed and Suspected/i)
            .click();

        cy.get('[data-cy="listed-country"]').eq(1).contains('Portugal');
        cy.get('[data-cy="listed-country"]').eq(2).contains('Spain');
    });
});
