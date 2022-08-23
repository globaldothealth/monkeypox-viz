// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-real-events/support';
// eslint-disable-next-line no-undef
Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('Write permission denied')) {
        return false;
    }
    if (err.message.includes('Read permission denied')) {
        return false;
    }
    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
});
