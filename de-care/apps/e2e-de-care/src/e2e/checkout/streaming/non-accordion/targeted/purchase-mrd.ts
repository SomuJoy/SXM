import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLoadAndOffersForMrd } from './common-utils/stubs';
import { visitCheckoutTargetedMrdWithAllowedProgramCode } from './common-utils/ui';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCheckEligibilityStreamingStreamingCommonSuccess,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingNonAccordionTargetedMultiRadioDiscountFirstOffer } from '../../../../../support/stubs/de-microservices/quotes';
import { stubValidatePasswordSuccess, stubValidateUniqueLoginSuccess } from '../../../../../support/stubs/de-microservices/validate';

Before(() => {
    cy.viewport('iphone-x');
    stubAccountLoadAndOffersForMrd();
});

// Common
When(/^a customer visits the targeted streaming purchase experience and is qualified for a multi radio discount$/, () => {
    visitCheckoutTargetedMrdWithAllowedProgramCode();
});

// Scenario: Customer can purchase a multi radio discount offer
Then(/^they go through all the purchase steps for the targeted experience$/, () => {
    stubValidatePasswordSuccess();
    stubValidateUniqueLoginSuccess();
    stubOffersCheckEligibilityStreamingStreamingCommonSuccess();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubQuotesQuoteStreamingNonAccordionTargetedMultiRadioDiscountFirstOffer();
    // Offer presentment step
    cy.get('[data-test="multiPackageSelectionFormSubmitButton"]').click();
    cy.get('[data-test="continueButton"]').click();
    // Credentials step
    cy.get('[data-test="sxmUIUsernameFormField"]').clear().type('mytest@siriusxm.com');
    cy.get('[data-test="sxmUIPasswordFormField"]').clear().type('P@ssword!');
    cy.get('[data-test="usernameAndPasswordFormSubmitButton"]').click();
    // Payment interstitial step
    cy.get('[data-test="continueButton"]').click();
    // Payment step
    cy.get('[data-test="sxmUINameOnCard"]').clear().type('Mary Test');
    cy.get('[data-test="sxmUICreditCardNumber"]').clear().type('4111111111111111');
    cy.get('[data-test="creditCardFormFields.ccExpirationDate"]').clear({ force: true }).type('0235', { force: true });
    cy.get('[data-test="sxmUICvvFormField"]').clear({ force: true }).type('123', { force: true });
    cy.get('[data-test="paymentInfoBasicFormSubmitButton"]').click();
});
Then(/^they should land on the targeted confirmation page$/, () => {
    // TODO: add test logic here
});

// Scenario: Customer is presented multi radio discount offer text copy
Then(/^they should be presented with an option to select a plan$/, () => {
    // TODO: add test logic here
});
Then(/^when they go through the purchase steps to the review step$/, () => {
    // TODO: add test logic here
});
Then(/^they should be presented with messaging about multi radio discount$/, () => {
    // TODO: add test logic here
});
