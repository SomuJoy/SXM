import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutFlepzFormAndSubmit, visitRegistrationOrganic } from './common-utils/ui';
import { stubIdentityRegistrationFlepzNoAccountFound, stubIdentityRegistrationFlepzSystemError } from '../../../../support/stubs/de-microservices/identity';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer should get a general error message after account lookup submission error
When(/^a user visits the registration page and submits lookup data that results in a general error$/, () => {
    visitRegistrationOrganic();
    stubIdentityRegistrationFlepzSystemError();
    fillOutFlepzFormAndSubmit();
});
Then(/^they should be shown a general error message$/, () => {
    cy.get('[data-test="sxmUiAlertPill"]').should('be.visible');
});

// Scenario: Customer should be able to update info after getting a general error message
Then(/^when they update the form with valid info and re-submit$/, () => {
    stubIdentityRegistrationFlepzNoAccountFound();
    fillOutFlepzFormAndSubmit();
});
