import { Before, Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    completeCheckoutWithCardOnFile,
    completeCheckoutWithNewPaymentMethod,
    completeCheckoutWithNewPaymentMethodSelection,
    goThroughTargetedSatellitePurchaseFlowWithActiveTrialAndCardOnFile,
    goThroughTargetedSatellitePurchaseFlowWithActiveTrialAndNoCardOnFile,
    visitLegacyCheckoutWithTrialCustomer,
} from '../common-utils/ui';
import { stubOffersSuccessSatellitePromoSelfPay } from '../../../../../support/stubs/de-microservices/offers';

Before(() => {
    stubOffersSuccessSatellitePromoSelfPay();
    cy.viewport('iphone-x');
});

// Common
Given(/^a customer visits the targeted satellite purchase experience with an account that has an active trial and has a card on file$/, () => {
    visitLegacyCheckoutWithTrialCustomer();
    goThroughTargetedSatellitePurchaseFlowWithActiveTrialAndCardOnFile();
});

// Scenario: Customer with active trial and a card on file is presented with the option to use it
Then(/^they should be presented with the options to use card on file or enter new card on the payment step$/, () => {
    cy.get('[data-test="PaymentInfoExistingCard"]').should('exist');
    cy.get('[data-test="PaymentInfoNewCard"]').should('exist');
});

// Scenario: Customer with active trial and a card on file can use card on file
Then(/^they should be able to use card on file and complete the transaction$/, () => {
    completeCheckoutWithCardOnFile();
    cy.url().should('contain', '/thanks');
});

// Scenario: Customer with active trial and a card on file can use a new payment method
Then(/^they should be able to enter a new payment method and complete the transaction$/, () => {
    completeCheckoutWithNewPaymentMethodSelection();
    cy.url().should('contain', '/thanks');
});

// Common
Given(/^a customer visits the targeted satellite purchase experience with an account that has an active trial and no card on file$/, () => {
    visitLegacyCheckoutWithTrialCustomer();
    goThroughTargetedSatellitePurchaseFlowWithActiveTrialAndNoCardOnFile();
});

// Scenario: Customer with active trial and no card on file is not presented with the option
Then(/^they should only be presented with the option enter new card on the payment step$/, () => {
    cy.get('[data-test="PaymentInfoExistingCard"]').should('not.exist');
    cy.get('[data-test="accordion-payment-step"]').should('exist');
});

// Scenario: Customer with active trial and no card on file can use a new payment method
Then(/^the user with no previous card on file should be able to enter a new payment method and complete the transaction$/, () => {
    completeCheckoutWithNewPaymentMethod();
    cy.url().should('contain', '/thanks');
});
