import { Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutFlepzFormAndSubmit, visitRegistrationOrganic } from './common-utils/ui';
import { stubIdentityRegistrationFlepzNoAccountFound } from '../../../../support/stubs/de-microservices/identity';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer should get to device lookup step when flepz lookup has no results
When(/^a user visits the registration page and submits lookup data that results in no account found$/, () => {
    visitRegistrationOrganic();
    stubIdentityRegistrationFlepzNoAccountFound();
    fillOutFlepzFormAndSubmit();
});
