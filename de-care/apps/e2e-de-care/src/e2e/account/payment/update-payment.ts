import { Before, Then, When, Given } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubAccountCreditCardCurrentBalance,
    stubAccountCreditCardNextPaymentAmount,
    stubAccountCreditCardCurrentAndNextPaymentAmount,
    stubAccountInvoiceCurrentAndNextPaymentAmount,
    stubAccountSuspendedRadio,
    stubReactivationQuote,
    stubCustomerInfo,
    stubMakePayment,
    stubUpdatePayment,
} from './common-utils/stubs';

import { stubAccountNextBestActionSuccessWithActions } from '../../../support/stubs/de-microservices/account';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../support/stubs/de-microservices/apigateway';

Before(() => {
    cy.viewport('iphone-x');
    stubApiGatewayUpdateUseCaseSuccess();
    stubAccountNextBestActionSuccessWithActions();
});

// Scenario: Credit Card and Next payment amount
Given(/^a customer has CC as payment method and only next payment amount$/, () => {
    stubAccountCreditCardNextPaymentAmount();
});

// Scenario: Credit Card and Current balance due
Given(/^a customer has CC as payment method and only current balance due$/, () => {
    stubAccountCreditCardCurrentBalance();
});

// Scenario: Credit Card and Current balance due plus Next payment amount
Given(/^a customer has CC as payment method and Current Balance plus Next payment amount$/, () => {
    stubAccountCreditCardCurrentAndNextPaymentAmount();
});

// Scenario: Credit Card and Suspendended radio
Given(/^a customer has CC as payment method and Suspended radio$/, () => {
    stubAccountSuspendedRadio();
    stubReactivationQuote();
});
Then(/^the customer should see the suspended subscriptions alert$/, () => {
    cy.get('[data-test="sxmUiAlertPill"]').should('exist');
});

// Scenario:  Complete payment transaction
Given(/^a customer has CC as payment method$/, () => {
    stubAccountCreditCardCurrentAndNextPaymentAmount();
    stubCustomerInfo();
    stubUpdatePayment();
});
Then(/^navigates to the update payment experience$/, () => {
    cy.visit('account/pay/make-payment?updatePayment=true');
});
When(/^the customer fills out the form$/, () => {
    cy.get('[data-test="CCAddress"]').clear({ force: true }).type('1 River Rd', { force: true });
    cy.get('[data-test="CCCity"]').clear({ force: true }).type('Schenectady', { force: true });
    cy.get('[data-test="CCState"]').contains('NY').click({ force: true });
    cy.get('[data-test="CCZipCode"]').clear({ force: true }).type('12345', { force: true });
    cy.get('[data-test="sxmUINameOnCard"]').type('TEST NAME');
    cy.get('[data-test="sxmUICreditCardNumber"]').clear().type('4111111111111111');
    cy.get('[data-test="creditCardFormFields.ccExpirationDate"]').clear({ force: true }).type('0225', { force: true });
    cy.get('[data-test="sxmUICvvFormField"]').clear().type('121');
});
Then(/^accepts agreement and clicks on the Submit Paymment button$/, () => {
    cy.get('[data-test="chargeAgreementGenericFormField"]').click({ force: true });
    cy.get('[data-test="SubmitPaymentButton"]').click();
});
Then(/^the experience should navigate to the confirmation page$/, () => {
    cy.url().should('contain', '/make-payment/thankyou');
});
Then(/^the customer should see update payment confirmation$/, () => {
    cy.get('[data-test="update-payment-header"]').should('exist');
});
