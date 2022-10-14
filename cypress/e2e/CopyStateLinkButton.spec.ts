describe('<CopyStateLinkButton />', () => {
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

    it('Displays button', () => {
        cy.visit('/');
        cy.url().should('include', '/country');

        cy.get('.popup-small-screens').should('not.exist');
        cy.contains(/COPY LINK TO/i).should('be.visible');

        cy.visit('/chart');
        cy.get('.popup-small-screens').should('not.exist');
        cy.contains(/COPY LINK TO/i).should('be.visible');
    });

    it('Copying proper link to clipboard', () => {
        cy.visit('/country');
        cy.wrap(
            Cypress.automation('remote:debugger:protocol', {
                command: 'Browser.grantPermissions',
                params: {
                    permissions: [
                        'clipboardReadWrite',
                        'clipboardSanitizedWrite',
                    ],
                    origin: window.location.origin,
                },
            }),
        );

        cy.wait(3000);

        cy.contains('Argentina').click();

        cy.get('.MuiSlider-track + span > input').invoke('attr', 'value', 12);

        cy.contains(/COPY LINK TO/i)
            .should('be.visible')
            .focus()
            .click();

        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
                expect(text).to.include('?name=ARG&currDate=12');
            });
        });

        cy.visit('/chart');

        cy.wait(3000);

        cy.contains('Argentina').click();

        //changing slider via attributes, cases in test = 12, 25% of 12 is 3, 9 - 3 = 6, 50% of 12 is 6
        cy.get('.MuiSlider-track').invoke('attr', 'style', [
            'left: 25%',
            'width: 50%',
        ]);

        cy.contains(/COPY LINK TO/i)
            .should('be.visible')
            .focus()
            .click();

        cy.window().then((win) => {
            win.navigator.clipboard.readText().then((text) => {
                expect(text).to.include('?name=ARG&startDate=3&endDate=9');
            });
        });
    });

    it('Display Alert', () => {
        cy.visit('/country?name=test&currDate=test');

        cy.wait(2000);
        cy.get('.MuiSlider-track').should(
            'have.attr',
            'style',
            'left: 0%; width: 100%;',
        );
        cy.contains(
            /Unfortunately, there is no data from the country that you have selected./i,
        ).should('be.visible');

        cy.url().should('not.include', '?');

        cy.wait(1500);
        cy.get('.MuiAlert-message').should('not.exist');

        cy.visit('/chart?name=test&startDate=test&endDate=test');

        cy.wait(2000);

        cy.get('.MuiSlider-track').should(
            'have.attr',
            'style',
            'left: 0%; width: 100%;',
        );

        cy.contains(
            /Unfortunately, there is no data from the country that you have selected./i,
        ).should('be.visible');
        cy.url().should('not.include', '?');

        cy.wait(1500);
        cy.get('.MuiAlert-message').should('not.exist');
    });

    it('Properly setup view via given URL', () => {
        cy.visit('/country?name=ARG&currDate=11');
        cy.wait(3000);
        cy.get('.MuiSlider-thumb > input').should('have.attr', 'value', '11');
        cy.get('.mapboxgl-popup-content').should('exist').contains('Argentina');

        cy.visit('/chart?name=ARG&startDate=3&endDate=9');
        cy.get('.MuiSlider-track').should(
            'have.attr',
            'style',
            'left: 27.2727%; width: 54.5455%;',
        );
        cy.contains(/Total confirmed cases: Argentina/i).should('exist');
    });
});
