import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLookupSuccess, stubCaptchaRequired, stubPaymentInfoSuccess } from '../../common-utils/stubs';
import { stubTransactionSuccess } from '../common-utils/stubs';
import {
    acceptAndFillOutCaptchaAndSubmitTransaction,
    clickContinueOnCredentialsInterstitial,
    clickContinueOnOfferPresentment,
    clickContinueOnPaymentInterstitial,
    fillOutAndSubmitAccountLookupForm,
    fillOutAndSubmitPaymentInfoForm,
    visitCheckoutOrganicWithAllowedProgramCode,
} from '../common-utils/ui';
import { stubOffersCustomerSuccessDigitalRtpFree, stubOffersSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingNonAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';
import { stubUtilityCaptchaValidateSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalRtpFree();
});
When('a customer goes through the organic streaming purchase steps with a valid program code and captcha is required', () => {
    visitCheckoutOrganicWithAllowedProgramCode();
    cy.wait('@offersInfo');
    clickContinueOnOfferPresentment();
    clickContinueOnCredentialsInterstitial();
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalRtpFree();
    fillOutAndSubmitAccountLookupForm();
    clickContinueOnPaymentInterstitial();
    stubPaymentInfoSuccess();
    stubCaptchaRequired();
    stubQuotesQuoteStreamingNonAccordionOrganicSuccess();
    fillOutAndSubmitPaymentInfoForm();
});
Then('they should be presented with the captcha field on the review order step', () => {
    cy.get('step-organic-review-page #nuCaptchaFieldSection').should('be.visible');
});
Then('they should be able to answer the captcha and submit the transaction', () => {
    cy.wait(1000);
    stubTransactionSuccess();
    stubUtilityCaptchaValidateSuccess();
    acceptAndFillOutCaptchaAndSubmitTransaction();
});
