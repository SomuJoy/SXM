import { Before, When, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';
import { stubOffersCustomerCancelStreamingWithPlatinum } from '../../../../support/stubs/de-microservices/offers';

import { stubAccountWithStreamingSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubCancelSubscriptionComplete } from '../../../../support/stubs/de-microservices/purchase';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';

Before(() => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithStreamingSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
});

// Scenario: Experience loads cancel reasons page for logged in customer with STREAMING subscription

When(/^a logged in customer navigates to the cancel option$/, () => {
    mockAdobeTarget([{ name: 'cancel-interstitial', options: [] }]);
    cy.visit('/subscription/cancel?subscriptionId=10003710601');
});
Then(/^they should see a page with the streaming cancel reasons$/, () => {
    cy.get('[data-test="cancelReasonsForm"]').should('be.visible');
    cy.get('[data-test="cancelReasonsItems"]').should('have.length', 7);
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
Then(/^if the customer clicks on the Continue button$/, () => {
    cy.get('[data-test="ContinueToCancelButton"]').click();
});
Then(/^the experience should load the offer page$/, () => {
    cy.get('[data-test="PreSelectedSecondPlanOfferHeader"]').should('exist');
});

//Scenario: Customer completes the cancelation preprocess
When(/^a customer clicks on Continue to cancel$/, () => {
    stubCancelSubscriptionComplete();
    cy.get('[data-test="cancelPlanButton"]').click();
});
Then(/^navigates to the Cancel summary step$/, () => {
    cy.get('[data-test="planToCancelInfo"]').should('exist');
    cy.get('[data-test="cancelSummaryBulletList"]').should('exist');
});
Then(/^clicks on the Cancel Subscription button$/, () => {
    cy.get('[data-test="cancelSubscriptionButton"]').click();
});
Then(/^navigates to the Cancel Confirmation Step$/, () => {
    cy.get('[data-test="cancellationDetailsHeader"]').should('exist');
});
