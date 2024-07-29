import { Then, Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLookupSuccess, stubCaptchaNotRequired, stubIneligiblePaymentInfoCalls } from '../../common-utils/stubs';
import { stubTransactionSuccess } from '../common-utils/stubs';
import {
    acceptAndSubmitTransaction,
    clickContinueOnCredentialsInterstitial,
    clickContinueOnOfferPresentment,
    clickContinueOnPaymentInterstitial,
    fillOutAndSubmitAccountLookupForm,
    fillOutAndSubmitPaymentInfoForm,
    visitCheckoutOrganicWithAllowedProgramCode,
} from '../common-utils/ui';
import { stubOffersCustomerSuccessDigitalRtpFree, stubOffersSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingCommonFallback } from '../../../../../support/stubs/de-microservices/quotes';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalRtpFree();
});

// Scenario: Customer should get a fallback offer when consumption logic identifies they are not eligible
When('a customer goes through the organic streaming purchase steps with a valid program code and non-qualifying data', () => {
    visitCheckoutOrganicWithAllowedProgramCode();
    clickContinueOnOfferPresentment();
    clickContinueOnCredentialsInterstitial();
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalRtpFree();
    fillOutAndSubmitAccountLookupForm();
    clickContinueOnPaymentInterstitial();
    stubIneligiblePaymentInfoCalls();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingCommonFallback();
    fillOutAndSubmitPaymentInfoForm();
});
Then('they should be able to complete the transaction', () => {
    stubTransactionSuccess();
    acceptAndSubmitTransaction();
});
