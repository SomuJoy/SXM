import { Before, When, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';

import { stubAccountWithStreamingSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubOffersCustomerCancelStreamingWithPlatinum } from '../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';

Before(() => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithStreamingSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
});

// Scenario: Experience loads the interstitial page before showing the offers
Given(/^the Target flag interstitial is enabled$/, () => {
    mockAdobeTarget([{ name: 'cancel-interstitial', options: [{ content: { flag: { interstitial: true } } }] }]);
});
When(/^a customer navigates to the Cancel subscription experience$/, () => {
    stubOffersCustomerCancelStreamingWithPlatinum();
    cy.visit('/subscription/cancel?subscriptionId=10003710601');
});
Then(/^selects any cancel reason to continue$/, () => {
    cy.get('[data-test="DONT_LISTEN"]').click({ force: true });
    cy.get('[data-test="CancelReasonsContinueButton"]').click({ force: true });
});
Then(/^the experience should load the interstitial page$/, () => {
    cy.get('[data-test="interstitialStepHeader"]').should('exist');
});

// Scenario: Experience does not load the interstitial page
Given(/^the Target flag interstitial is not enabled$/, () => {
    mockAdobeTarget([{ name: 'cancel-interstitial', options: [{ content: { flag: { interstitial: false } } }] }]);
});
Then(/^the experience should not load the interstitial page$/, () => {
    cy.get('[data-test="interstitialStepHeader"]').should('not.exist');
});
