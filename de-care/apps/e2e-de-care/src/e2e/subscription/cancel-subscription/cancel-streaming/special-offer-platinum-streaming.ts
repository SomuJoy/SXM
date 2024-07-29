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
    mockAdobeTarget([{ name: 'cancel-interstitial', options: [{ content: { flag: { interstitial: false } } }] }]);
});

// Scenario: Experience should load the special preselected offer page instead of the grid
Given(/^the Platinum Streaming plan is returend by PEGA$/, () => {
    stubOffersCustomerCancelStreamingWithPlatinum();
});
When(/^a customer navigates to the Cancel subscription experience$/, () => {
    cy.visit('/subscription/cancel?subscriptionId=10003710601');
});
Then(/^selects any cancel reason to continue$/, () => {
    cy.get('[data-test="DONT_LISTEN"]').click({ force: true });
    cy.get('[data-test="CancelReasonsContinueButton"]').click({ force: true });
});
Then(/^the experience should load the special preselected offer page$/, () => {
    cy.get('[data-test="PreSelectedSecondPlanOfferHeader"]').should('exist');
});
