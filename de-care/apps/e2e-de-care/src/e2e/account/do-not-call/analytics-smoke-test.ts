import { Before, When } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    cy.visit('donotcall');
});
