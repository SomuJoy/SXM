import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { mockAdobeTarget } from '../../../../support/stubs/common/adobe';

import { stubAccountWithSatelliteSubscriptionLoaded } from '../../../../support/stubs/de-microservices/account';
import { stubModifySubscriptionOptionsWithCancelEnabled } from '../../../../support/stubs/de-microservices/account-mgmt';
import { stubPurchaseChangeSubscriptionCCFraud } from '../../../../support/stubs/de-microservices/purchase';
import { stubOffersCustomerCancelSatellite } from '../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuotePromoAllAccess12Mo99 } from '../../../../support/stubs/de-microservices/quotes';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../support/stubs/de-microservices/apigateway';
import { stubValidateCustomerInfoNewCC } from '../../../../support/stubs/de-microservices/validate';

// Scenario: Customer enters an invalid credit card
When('a logged in customer enters to the Cancel Subscription flow', () => {
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountWithSatelliteSubscriptionLoaded();
    stubModifySubscriptionOptionsWithCancelEnabled();
    stubQuotesQuotePromoAllAccess12Mo99();
    stubPurchaseChangeSubscriptionCCFraud();
    stubValidateCustomerInfoNewCC();
    mockAdobeTarget();
    cy.visit('/subscription/cancel?subscriptionId=10000218132');
});

Then('completes all steps to get a new subscription', () => {
    stubOffersCustomerCancelSatellite();
    cy.get('[data-test="DONT_LISTEN"]').click({ force: true });
    cy.get('[data-test="CancelReasonsContinueButton"]').click({ force: true });
    cy.get('[data-test="optionTab1"]').click();
    cy.get('[data-test="cancelOfferGridCta"]').click();
    cy.get('[data-test="pickYourBillingPlan1"]').click();
    cy.get('[data-test="BillingTermContinueButton"]').click();
    cy.get('[data-test="PaymentInfoNewCard"]').click();
});

Then('enters an invalid credit card in the Payment Info section', () => {
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCAddress"]').clear({ force: true }).type('1 River Rd', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCCity"]').clear({ force: true }).type('Schenectady', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCState"]').contains('NY').click({ force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCZipCode"]').clear({ force: true }).type('12345', { force: true });
    cy.get('[data-test="CCNameOnCardTextfield"]').clear().type('TEST NAME');
    cy.get('[data-test="CCCardNumberTextfield"]').clear().type('4111111111111111');
    cy.get('[data-test="ccExpDateOnCardTextfield"]').clear({ force: true }).type('0225', { force: true });
    cy.get('[data-test="ccCVV"]').clear().type('121');
    cy.get('[data-test="PaymentConfirmationButton"]').click();
});

Then('accepts and completes the order', () => {
    cy.get('[data-test="ChargeMyCardText"]').click({ force: true });
    cy.get('[data-test="CompleteMyOrderButton"]').click();
});

Then('experience should display an error message', () => {
    cy.get('[data-test="UnauthorizedCreditCardErrorMessage"]').should('be.visible');
});

Then('the credit card number input should be masked', () => {
    cy.get('[data-test="CCCardNumberTextfieldMasked"]').should('be.visible');
});
