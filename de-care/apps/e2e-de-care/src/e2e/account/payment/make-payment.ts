import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubAccountCreditCardCurrentAndNextPaymentAmount,
    stubAccountCreditCardCurrentBalance,
    stubAccountCreditCardNextPaymentAmount,
    stubAccountInvoiceCurrentAndNextPaymentAmount,
    stubAccountSuspendedRadio,
    stubCustomerInfo,
} from './common-utils/stubs';

import { stubAccountNextBestActionSuccessWithActions } from '../../../support/stubs/de-microservices/account';
import { stubMakePayment } from '../../../support/stubs/de-microservices/payment';
import { stubQuotesReactivationQuote } from '../../../support/stubs/de-microservices/quotes';
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
When(/^the customer enters the make-payment experience$/, () => {
    cy.visit('account/pay/make-payment');
});
Then(/^the customer should not see the Next payment due box$/, () => {
    cy.get('[data-test="BalanceBoxTitle"]').should('not.exist');
});
Then(/^should not see the payment amount selection$/, () => {
    cy.get('[data-test="PaymentAmountRadioButtonsSection"]').should('not.exist');
});

// Scenario: Credit Card and Current balance due
Given(/^a customer has CC as payment method and only current balance due$/, () => {
    stubAccountCreditCardCurrentBalance();
});
Then(/^the customer should see the Current balance due box$/, () => {
    cy.get('[data-test="BalanceBoxTitle"]').should('be.visible').and('contain', 'Current balance due');
});

// Scenario: Credit Card and Current balance due plus Next payment amount
Given(/^a customer has CC as payment method and Current Balance plus Next payment amount$/, () => {
    stubAccountCreditCardCurrentAndNextPaymentAmount();
});
Then(/^not the Next payment amount box$/, () => {
    cy.get('[data-test="BalanceBoxTitle"]').should('be.visible').and('not.contain', 'Next payment amount');
});

// Scenario: Credit Card and Suspendended radio
Given(/^a customer has CC as payment method and Suspended radio$/, () => {
    stubAccountSuspendedRadio();
    stubQuotesReactivationQuote();
});
Then(/^the customer should see the suspended subscriptions alert$/, () => {
    cy.get('[data-test="sxmUiAlertPill"]').should('exist');
});
Then(/^the Total Due Now box$/, () => {
    cy.get('[data-test="BalanceBoxTitle"]').should('be.visible').and('contain', 'Total Due Now');
});
Then(/^the Reactivation balance accordion$/, () => {
    cy.get('[data-test="ReactivationBalanceAccordion"]').should('exist');
});

//   Scenario: Payment type Invoice
Given(/^a customer has Invoice as payment method$/, () => {
    stubAccountInvoiceCurrentAndNextPaymentAmount();
});
Then(/^the customer should see the Payment frequency selection$/, () => {
    cy.get('[data-test="PaymentFrequencyRadioButtonsSection"]').should('exist').and('be.visible');
});

// Scenario:  Complete payment transaction
Given(/^a customer navigates to the payment experience$/, () => {
    stubAccountCreditCardCurrentAndNextPaymentAmount();
    stubCustomerInfo();
    stubMakePayment();
    cy.visit('account/pay/make-payment');
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

//Scenario: Complete payment transaction with suspended radio
Given(/^a customer with a suspended radio navigates to the payment experience$/, () => {
    stubAccountSuspendedRadio();
    stubQuotesReactivationQuote();
    stubCustomerInfo();
    stubMakePayment();
    cy.visit('account/pay/make-payment');
});
Then(/^display the Radio Activation option$/, () => {
    cy.get('[data-test="RefreshSignalComponent"]').should('exist').and('be.visible');
});
