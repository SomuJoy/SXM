import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubChangeSubscriptionTargetedToken } from './common-utils/stubs';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Experience loads correct change plan offer for targeted with token
When(/^a customer navigages with a valid token and is eligible for the upgrade$/, () => {
    stubChangeSubscriptionTargetedToken();
    cy.visit('/subscription/change?tkn=VALID_TOKEN&task=upgrade');
});
Then(/^they should see a step for choosing a package with the first one being preselected$/, () => {
    cy.get('[data-test="offerCardFormFieldOption"]').first().should('exist');
    cy.get('[data-test="sxmUiRadioOptionFormField"]').first().should('be.checked');
});
