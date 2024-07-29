import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLoadAndOffersForAddStreamingMrd } from './common-utils/stubs';
import { visitCheckoutTargetedAddStreamingUrl } from './common-utils/ui';
import { stubCheckEligibilityCaptchaNotRequiredSuccess, stubOffersCheckEligibilityStreamingCommonSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubPurchaseAddSubscriptionStreamingCommonSuccess } from '../../../../../support/stubs/de-microservices/purchase';
import { stubQuotesQuoteStreamingNonAccordionTargetedMultiRadioDiscountAddStreaming } from '../../../../../support/stubs/de-microservices/quotes';
import { stubValidatePasswordSuccess, stubValidateUniqueLoginSuccess } from '../../../../../support/stubs/de-microservices/validate';

Before(() => {
    cy.viewport('iphone-x');
    stubAccountLoadAndOffersForAddStreamingMrd();
});

When('customer which applies to MRD enters into add streaming flow', () => {
    visitCheckoutTargetedAddStreamingUrl();
    cy.get('step-add-streaming-pick-a-plan').should('be.visible');
});

Then('goes through all the expexted steps for add streaming targeted experience', () => {
    stubValidatePasswordSuccess();
    stubValidateUniqueLoginSuccess();
    stubOffersCheckEligibilityStreamingCommonSuccess();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubQuotesQuoteStreamingNonAccordionTargetedMultiRadioDiscountAddStreaming();
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
    cy.get('[data-test="sxmUiRadioOptionFormField"]').eq(1).click({ force: true });
    cy.get('[data-test="sxmUINameOnCard"]').clear().type('Mary Test');
    cy.get('[data-test="sxmUICreditCardNumber"]').clear().type('4111111111111111');
    cy.get('[data-test="creditCardFormFields.ccExpirationDate"]').clear({ force: true }).type('0235', { force: true });
    cy.get('[data-test="sxmUICvvFormField"]').clear({ force: true }).type('123', { force: true });
    cy.get('[data-test="paymentInfoBasicFormSubmitButton"]').click();
});

Then('user could purchase and add a streaming subscription to the account', () => {
    stubPurchaseAddSubscriptionStreamingCommonSuccess();
    cy.get('[data-test="chargeAgreementFormField"]').click({ force: true });
    cy.get('[data-test="ReviewQuoteAndApproveFormSubmitButton"]').click();
    cy.get('organic-add-streaming-confirmaton-page').should('be.visible');
});
