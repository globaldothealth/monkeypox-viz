describe('<SideBar />', () => {
    beforeEach(() => {
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json', statusCode: 200 },
        ).as('fetchCountriesData');
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
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/country/latest.json',
            { fixture: 'countriesData.json', statusCode: 200, delay: 3000 },
        ).as('fetchCountriesData');
        cy.intercept(
            'GET',
            'https://monkeypox-aggregates.s3.eu-central-1.amazonaws.com/total/latest.json',
            { fixture: 'totalCasesData.json', statusCode: 200, delay: 3000 },
        ).as('fetchTotalCasesData');

        cy.visit('/');

        cy.get('[data-cy="loading-skeleton"]').should('have.length', 3);

        cy.wait('@fetchCountriesData');
        cy.wait('@fetchTotalCasesData');

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

        cy.get('[data-cy="autocomplete-input"').should('have.value', '');
        const listedCountries = cy.get('[data-cy="listed-country"]');
        listedCountries.should('have.length.gte', 5);

        cy.contains(/Germany/i).click();

        cy.get('[data-cy="autocomplete-input"').should('have.value', 'Germany');
    });
});
