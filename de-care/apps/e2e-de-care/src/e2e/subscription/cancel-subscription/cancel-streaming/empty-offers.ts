import { Before, When, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';

import { stubAccountWithStreamingSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubOffersCustomerCancelEmptyOffers } from '../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';

Before(() => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithStreamingSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
    mockAdobeTarget([{ name: 'cancel-interstitial', options: [{ content: { flag: { interstitial: false } } }] }]);
});

//  Scenario: Experience should load the no-offers page
Given(/^that offers response contains an empty offers array$/, () => {
    stubOffersCustomerCancelEmptyOffers();
});
When(/^a customer navigates to the Cancel subscription experience$/, () => {
    cy.visit('/subscription/cancel?subscriptionId=10003710601');
});
Then(/^selects any cancel reason to continue$/, () => {
    cy.get('[data-test="DONT_LISTEN"]').click({ force: true });
    cy.get('[data-test="CancelReasonsContinueButton"]').click({ force: true });
});
Then(/^the experience should load the no-offers page$/, () => {
    cy.get('[data-test="cancelNoOffersHeader"]').should('be.visible');
});
