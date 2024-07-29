import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubOffersSuccessSatellitePromoSelfPay } from '../../../../../support/stubs/de-microservices/offers';
import {
    completeCheckoutWithCardOnFile,
    completeCheckoutWithNewPaymentMethod,
    completeCheckoutWithNewPaymentMethodSelection,
    goThroughOrganicSatellitePurchaseFlowWithActiveTrialAndCardOnFile,
    identifyWithRadioIdAndNoCardOnFile,
    visitFlepz,
} from '../common-utils/ui';

Before(() => {
    stubOffersSuccessSatellitePromoSelfPay();
    cy.viewport('iphone-x');
});

// Scenario: Customer with active trial and a card on file is presented with the option to use it
Given(/^a customer visits the organic satellite purchase flow$/, () => {
    visitFlepz();
});
When(/^they identify with an account that has an active trial and has a card on file$/, () => {
    goThroughOrganicSatellitePurchaseFlowWithActiveTrialAndCardOnFile();
});
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

// Scenario: Customer with active trial and no card on file is not presented with the option
When(/^they identify with an account that has an active trial and no card on file$/, () => {
    identifyWithRadioIdAndNoCardOnFile();
});
Then(/^they should only be presented with the option enter new card on the payment step$/, () => {
    cy.get('[data-test="PaymentInfoExistingCard"]').should('not.exist');
    cy.get('[data-test="accordion-payment-step"]').should('exist');
});

// Scenario: Customer with active trial and no card on file can use a new payment method
Then(/^the user with no previous card on file should be able to enter a new payment method and complete the transaction$/, () => {
    completeCheckoutWithNewPaymentMethod();
    cy.url().should('contain', '/thanks');
});
