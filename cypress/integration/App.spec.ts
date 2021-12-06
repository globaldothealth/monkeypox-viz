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

    it('Displays Navbar items', () => {
        cy.visit('/');

        cy.contains(/Country view/i).should('be.visible');
        cy.contains(/Regional view/i).should('be.visible');
        cy.contains(/Coverage/i).should('be.visible');
        cy.contains(/Variant Reporting/i).should('be.visible');
        cy.contains(/G.h Data/i).should('be.visible');
    });

    it('Navigates to different views', () => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json' },
        ).as('fetchCountriesData');

        cy.visit('/');
        cy.wait('@fetchCountriesData');

        cy.contains(/Country view/i).click();
        cy.contains(/Line List Cases/i).should('be.visible');
        cy.url().should('eq', 'http://localhost:3000/country');

        cy.contains(/Regional View/i).click();
        cy.contains(/Regional view/i).should('be.visible');
        cy.url().should('eq', 'http://localhost:3000/region');

        cy.contains(/Coverage/i).click();
        cy.contains(/Coverage/i).should('be.visible');
        cy.url().should('eq', 'http://localhost:3000/coverage');

        cy.contains(/Variant Reporting/i).click();
        cy.contains(/Variant reporting/i).should('be.visible');
        cy.url().should('eq', 'http://localhost:3000/variant-reporting');

        cy.contains(/G.h Data/i)
            .should('have.attr', 'href')
            .and('eq', 'https://dev-data.covid-19.global.health');
    });
});
