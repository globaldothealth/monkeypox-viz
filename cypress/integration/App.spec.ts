describe('<App />', () => {
    it('Shows loading indicator while fetching data', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json' },
        ).as('fetchCountriesData');

        cy.visit('/');

        cy.get('.MuiCircularProgress-root')
            .should('exist')
            .should('be.visible');

        cy.wait('@fetchCountriesData');

        cy.get('.MuiCircularProgress-root').should('not.exist');
    });

    it('Shows error alert when fetching fails', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/country/latest.json',
            { statusCode: 403 },
        ).as('fetchCountriesData');

        cy.visit('/');

        cy.wait('@fetchCountriesData');

        cy.contains('Error').should('be.visible');
        cy.contains('Fetching countries data failed').should('be.visible');
    });
});
