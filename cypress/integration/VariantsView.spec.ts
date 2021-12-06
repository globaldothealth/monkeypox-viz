describe('<VariantsView />', () => {
    beforeEach(() => {
        cy.intercept(
            'GET',
            'https://covid-19-aggregates-dev.s3.eu-central-1.amazonaws.com/variant-reporting-data.json',
            { fixture: 'variantsData.json' },
        ).as('fetchVariantsData');
    });

    it('Displays map and legend', () => {
        cy.visit('/variant-reporting');

        cy.wait('@fetchVariantsData');

        cy.get('.mapboxgl-canvas').should('be.visible');
        cy.contains(/To be determined/i).should('be.visible');
    });

    it('Displays loading skeletons inside SideBar', () => {
        cy.visit('/variant-reporting');

        cy.get('[data-cy=loading-skeleton]').should('have.lengthOf', 2);

        cy.wait('@fetchVariantsData');

        cy.get('[data-cy=loading-skeleton]').should('not.exist');
    });

    it("Can change between VoC's and VoI's", () => {
        cy.visit('/variant-reporting');
        cy.wait('@fetchVariantsData');

        // Check if there are two radio buttons
        cy.get('[type="radio"]').should('have.lengthOf', 2);

        cy.contains(/Choose Variant of Concern/i).should('be.visible');
        cy.contains(/Choose Variant of Interest/i).should('not.exist');

        cy.get('[type="radio"]').last().check();

        cy.contains(/Choose Variant of Concern/i).should('not.exist');
        cy.contains(/Choose Variant of Interest/i).should('be.visible');
    });
});
