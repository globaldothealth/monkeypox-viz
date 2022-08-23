// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

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
// Alternatively you can use CommonJS syntax:
// require('./commands')
