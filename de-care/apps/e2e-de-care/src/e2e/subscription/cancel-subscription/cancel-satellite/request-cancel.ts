import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';
import { stubOffersCustomerCancelSatellite } from '../../../../support/stubs/de-microservices/offers';
import { stubAccountWithSatelliteSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubPurchaseChangeSubscription } from '../../../../support/stubs/de-microservices/purchase';
import { stubQuotesQuotePromoAllAccess12Mo99 } from '../../../../support/stubs/de-microservices/quotes';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';

beforeEach(() => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithSatelliteSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
    mockAdobeTarget();
});

// Scenario: Experience loads cancel reasons page for logged in customer with SATELLITE subscription

When('a logged in customer navigates to the cancel option', () => {
    cy.visit('/subscription/cancel?subscriptionId=10000218132');
});
Then(/^they should see a page with the satellite cancel reasons$/, () => {
    cy.get('[data-test="cancelReasonsForm"]').should('exist');
    cy.get('[data-test="cancelReasonsItems"]').should('have.length', 5);
});

// Scenario: Experience loads options for the customer to choose a new Plan from a grid

When(/^a customer selects any reason$/, () => {
    stubOffersCustomerCancelSatellite();
    cy.get('[data-test="DONT_LISTEN"]').click({ force: true });
});

Then(/^clicks on the Cancel Reasons Continue button$/, () => {
    cy.get('[data-test="CancelReasonsContinueButton"]').click({ force: true });
});

Then(/^the experience should load the plans grid for the customer$/, () => {
    cy.get('[data-test="planGrid"]').should('exist');
});

//  Scenario: Customer can select a new plan

When(/^a customer selects a new plan in the grid$/, () => {
    stubPurchaseChangeSubscription();
    cy.get('[data-test="optionTab1"]').click();
});

Then(/^clicks on the Switch Subscription button$/, () => {
    cy.get('[data-test="cancelOfferGridCta"]').click();
});

Then(/^navigates to Pick your billing plan step$/, () => {
    cy.get('[data-test="acceptOfferStepper"]').should('exist');
});

// Scenario: Customer can select a billing plan
When(/^a customer selects a billing plan$/, () => {
    cy.get('[data-test="pickYourBillingPlan1"]').click();
});

Then(/^clicks on the Continue button$/, () => {
    cy.get('[data-test="BillingTermContinueButton"]').click();
});
Then(/^navigates to the payment information step$/, () => {
    cy.get('[data-test="PaymentForm"]').should('exist');
});

// Scenario: Custemr can select a payment method
When(/^a customer selects the existing credit card option$/, () => {
    stubQuotesQuotePromoAllAccess12Mo99();
    cy.get('[data-test="PaymentInfoExistingCard"]').click();
});
Then(/^clicks on the Continue button in the payment information step$/, () => {
    cy.get('[data-test="PaymentConfirmationButton"]').click();
});
Then(/^navigates to the quote$/, () => {});

// Scenario: Customer can purchase the new plan selected
When(/^a customer accepts the Credit Card Agreement$/, () => {
    stubPurchaseChangeSubscription();
    cy.get('[data-test="ChargeMyCardText"]').click();
});
Then(/^clicks on the Complete my order button$/, () => {
    cy.get('[data-test="CompleteMyOrderButton"]').click();
});
Then(/^the customer is redirected to the confirmation page$/, () => {
    cy.url().should('contain', 'subscription/cancel/thanks');
});
