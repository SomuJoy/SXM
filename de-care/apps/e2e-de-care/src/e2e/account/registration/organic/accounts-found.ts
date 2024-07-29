import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { fillOutFlepzFormAndSubmit, visitRegistrationOrganic } from './common-utils/ui';
import { stubIdentityRegistrationFlepzTwoAccountsFound } from '../../../../support/stubs/de-microservices/identity';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Customer should get to accounts found step when flepz lookup has multiple results
When(/^a user visits the registration page and submits lookup data that results in multiple account found$/, () => {
    visitRegistrationOrganic();
    stubIdentityRegistrationFlepzTwoAccountsFound();
    fillOutFlepzFormAndSubmit();
});
Then(/^there should be multiple account results displayed$/, () => {
    cy.get(':nth-child(1) > [data-test="accountAndSubscriptionsInfo"]').should('exist');
    cy.get(':nth-child(2) > [data-test="accountAndSubscriptionsInfo"]').should('exist');
});
