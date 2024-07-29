import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubChangeSubscriptionTargetedToken } from './common-utils/stubs';

Before(() => {});

// Scenario: Legacy digital data object exists on Window object
When(/^a customer visits the experience$/, () => {
    stubChangeSubscriptionTargetedToken();
    cy.visit('/subscription/change?tkn=VALID_TOKEN&task=upgrade');
});
