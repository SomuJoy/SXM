import { Before, When, Then, Given } from '@badeball/cypress-cucumber-preprocessor';
import { stubChangeSubscriptionFutureDatedChangePlan } from './common-utils/stubs';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Experience opens modal if account has Self pay and promo follow-on
Given('a customer has a self pay account with a promo follow on plan', () => {
    stubChangeSubscriptionFutureDatedChangePlan();
    cy.visit('subscription/change?subscriptionId=10022529582');
});
When('the customer selects a new plan and continue', () => {
    cy.get('[data-test="offerCardFormFieldOption"]').first().should('exist');
    cy.get('[data-test="sxmUiRadioOptionFormField"]').first().click({ force: true });
    cy.get('[data-test="multiPackageSelectionFormSubmitButton"]').click();
});

Then('a warning modal window should display', () => {
    cy.get('[data-test="packageChangeConfirmationModalHeader"]').should('be.visible');
});

// Scenario: Experience opens modal if account has Self pay and promo follow-on - downgrade
When('the customer selects a downgrade plan and continue', () => {
    cy.get('[data-test="offerCardFormFieldOption"]').last().should('exist');
    cy.get('[data-test="sxmUiRadioOptionFormField"]').last().click({ force: true });
    cy.get('[data-test="multiPackageSelectionFormSubmitButton"]').click();
});
Then('should contain a list of excluded channels', () => {
    cy.get('[data-test="excludedChannelsListModal"]').should('have.length.gt', 0);
});
