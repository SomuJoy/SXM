import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { getDigitalDataCustomerInfo } from '../../../../common-utils/digital-data';
import { acceptAndSubmitTransaction, goThroughTransactionUpToReviewStep } from '../common-utils/ui';
import {
    stubPurchaseNewAccountTransactionPasswordError,
    stubTransactionInvalidCreditCard,
    stubTransactionInvalidCreditCardExpiration,
    stubTransactionSystemError,
} from '../../../../../support/stubs/de-microservices/purchase';
import { stubOffersSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalRtpFree();
});

// Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission
When(/^a customer goes through the organic streaming purchase steps with a valid program code and invalid credit card expiration$/, () => {
    goThroughTransactionUpToReviewStep();
    stubTransactionInvalidCreditCardExpiration();
    acceptAndSubmitTransaction();
});

// Scenario: Customer should get a credit card error for fraud on the payment step after transaction submission
When(/^a customer goes through the organic streaming purchase steps with a valid program code and invalid credit card$/, () => {
    goThroughTransactionUpToReviewStep();
    stubTransactionInvalidCreditCard();
    acceptAndSubmitTransaction();
});

// Scenario: Customer should get a general system error on the payment step after transaction submission
When(/^a customer goes through the organic streaming purchase steps with a valid program code and a system error occurs on purchase transaction$/, () => {
    goThroughTransactionUpToReviewStep();
    stubTransactionSystemError();
    acceptAndSubmitTransaction();
});
Then(/^they should be taken back to the payment step and shown a general system error message in the credit card section$/, () => {
    cy.get('step-organic-payment-page').should('be.visible');
    cy.get('#unexpectedProcessingError').should('be.visible');
});

// Scenario: Customer should get a password error on the credentials step after transaction submission
When(/^a customer goes through the organic streaming purchase steps with a valid program code and a password error occurs on purchase transaction$/, () => {
    goThroughTransactionUpToReviewStep();
    stubPurchaseNewAccountTransactionPasswordError();
    acceptAndSubmitTransaction();
});
Then(/^they should be taken back to the credentials step and shown a password error message$/, () => {
    cy.get('step-organic-credentials-page').should('be.visible');
    cy.get('sxm-ui-password-form-field .invalid-feedback').should('be.visible');
});

// Scenario: Customer should get a new transaction id on credit card error
When(/^a customer goes through the organic streaming purchase steps with a valid program code and a new transaction id and invalid credit card$/, () => {
    goThroughTransactionUpToReviewStep();
    stubTransactionInvalidCreditCard();
    getDigitalDataCustomerInfo().then((customerInfo) => {
        cy.wrap(customerInfo?.transactionId).as('firstTransactionId');
    });
    acceptAndSubmitTransaction();
});
Then(/^a new transaction id should be generated$/, () => {
    getDigitalDataCustomerInfo().then(function (customerInfo) {
        expect(customerInfo?.transactionId).to.not.equal(this.firstTransactionId);
    });
});

// Common
Then(/^they should be taken back to the payment step and shown an error message in the credit card section$/, () => {
    cy.get('step-organic-payment-page').should('be.visible');
    cy.get('#creditCardProcessingError').should('be.visible');
});
