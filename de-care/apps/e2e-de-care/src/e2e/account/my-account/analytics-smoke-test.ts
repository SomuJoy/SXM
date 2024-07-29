import { Before, When } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {});

// Scenario: Legacy digital data object exists on Window object for login page
When(/^a customer visits the login page$/, () => {
    cy.visit('/account/login');
});
