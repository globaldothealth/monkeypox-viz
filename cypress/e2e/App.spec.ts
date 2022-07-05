describe('<App />', () => {
    it('Shows loading indicator while fetching data', () => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json', delay: 1000 },
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
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country/latest.json',
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
    });

    it('Navigates to different views', () => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country/latest.json',
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
    });
});
