import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: User can enter filters and complete
Given(/^a user visits the channel suggestion filter experience$/, () => {
    cy.visit('');
});
When(/^they go through all the filter steps$/, () => {
    // TODO: add test logic here
});
Then(/^they should land on the channel suggestion page$/, () => {
    // TODO: add test logic here
});
