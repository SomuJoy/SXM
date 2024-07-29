import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLookupSuccess, stubCaptchaNotRequired, stubPaymentInfoSuccess } from '../../common-utils/stubs';
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
import { stubQuotesQuoteStreamingNonAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalRtpFree();
});

// Scenario: Customer can purchase offer
When('a customer goes through the organic streaming purchase steps with a valid program code', () => {
    visitCheckoutOrganicWithAllowedProgramCode();
    cy.wait('@offersInfo');
    clickContinueOnOfferPresentment();
    clickContinueOnCredentialsInterstitial();
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalRtpFree();
    fillOutAndSubmitAccountLookupForm();
    clickContinueOnPaymentInterstitial();
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingNonAccordionOrganicSuccess();
    fillOutAndSubmitPaymentInfoForm();
    stubTransactionSuccess();
    acceptAndSubmitTransaction();
});
Then('they should be able to register on the confirmation page', () => {});

// Scenario: Customer visiting the old min variant URL gets redirect to main URL
When('a customer visits the organic streaming purchase steps min variant URL with query params', () => {
    cy.visit('/subscribe/checkout/purchase/streaming/organic/variant2?programcode=USTPSRTP3MOFREE');
});

// Scenario: Customer visiting the old min2 variant URL gets redirect to main URL
When('a customer visits the organic streaming purchase steps min2 variant URL with query params', () => {
    cy.visit('/subscribe/checkout/purchase/streaming/organic/variant2?programcode=USTPSRTP3MOFREE');
});

// Scenario: Customer visiting the old variant1 variant URL gets redirect to main URL
When('a customer visits the organic streaming purchase steps variant1 variant URL with query params', () => {
    cy.visit('/subscribe/checkout/purchase/streaming/organic/variant2?programcode=USTPSRTP3MOFREE');
});

// Scenario: Customer visiting the old variant2 variant URL gets redirect to main URL
When('a customer visits the organic streaming purchase steps variant2 variant URL with query params', () => {
    cy.visit('/subscribe/checkout/purchase/streaming/organic/variant2?programcode=USTPSRTP3MOFREE');
});

// Common redirection step for variants
Then('they should get redirected to the main organic streaming purchase URL with the same query params', () => {
    cy.url().should('contain', 'subscribe/checkout/purchase/streaming/organic?programcode=USTPSRTP3MOFREE');
});
