import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubAccountLookupSuccess,
    stubCaptchaNotRequired,
    stubIneligiblePaymentInfoCalls,
    stubOfferAndUpsellsTermOnly,
    stubPaymentInfoSuccess,
} from '../../common-utils/stubs';
import { stubTransactionSuccess, stubTransactionUpsellTermSuccess } from '../common-utils/stubs';
import {
    acceptAndSubmitTransaction,
    clickContinueOnCredentialsInterstitial,
    clickContinueOnOfferPresentment,
    clickContinueOnPaymentInterstitial,
    fillOutAndSubmitAccountLookupForm,
    fillOutAndSubmitPaymentInfoForm,
    selectTermUpsellAndSubmitPaymentForm,
    visitCheckoutOrganicWithAllowedProgramCodeAndUpcode,
} from '../common-utils/ui';
import { stubOffersCustomerSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingCommonFallback, stubQuotesQuoteStreamingNonAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';

Before(() => {
    cy.viewport('iphone-x');
});

// Common steps
When(/^a customer goes through the organic streaming purchase steps when qualifying for a term upsell$/, () => {
    stubOfferAndUpsellsTermOnly();
    visitCheckoutOrganicWithAllowedProgramCodeAndUpcode();
    cy.wait('@offersInfo');
    clickContinueOnOfferPresentment();
    clickContinueOnCredentialsInterstitial();
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalRtpFree();
    fillOutAndSubmitAccountLookupForm();
    clickContinueOnPaymentInterstitial();
});
Then(/^they should be presented with the term upsell option$/, () => {
    cy.get('[data-test="checkoutTermUpsellForm"]').should('be.visible');
    cy.get('[data-test="upsellOptionLeadOffer"]').should('be.visible');
    cy.get('[data-test="upsellOptionTermOffer"]').should('be.visible');
    cy.get('[data-test="offerLegalCopy"]').should('be.visible');
});
Then(/^they enter non-qualifying data for the payment step and try and complete the transaction$/, () => {
    cy.get('[data-test="upsellOptionTermOffer"]').click();
    stubIneligiblePaymentInfoCalls();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingCommonFallback();
    fillOutAndSubmitPaymentInfoForm();
});

// Scenario: Customer can purchase term upsell offer
Then(/^they should be able to complete the transaction for the term upsell offer$/, () => {
    selectTermUpsellAndSubmitPaymentForm();
    stubTransactionUpsellTermSuccess();
    acceptAndSubmitTransaction();
});
Then(/^the deal redemption instructions should be presented$/, () => {
    cy.get('[data-test="dealRedemptionInstructionsWithCta"]').should('be.visible');
});

// Scenario: Customer can purchase lead offer when presented term upsell offer
Then(/^they should be able to complete the transaction for the lead offer$/, () => {
    cy.get('[data-test="upsellOptionLeadOffer"]').click();
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingNonAccordionOrganicSuccess();
    fillOutAndSubmitPaymentInfoForm();
    stubTransactionSuccess();
    acceptAndSubmitTransaction();
});
Then(/^the deal redemption instructions should not be presented$/, () => {
    cy.get('[data-test="dealRedemptionInstructionsWithCta"]').should('not.exist');
});

// Scenario: Upsell options go away when customer is not allowed offer based on consumption logic
Then(/^when they go back to the payment step they should not be presented with the term upsell option$/, () => {
    cy.go('back');
    cy.get('[data-test="checkoutTermUpsellForm"]').should('not.exist');
});
Then(/^they should be able to complete the transaction for the fallback offer$/, () => {
    stubPaymentInfoSuccess();
    stubQuotesQuoteStreamingCommonFallback();
    fillOutAndSubmitPaymentInfoForm();
    stubTransactionSuccess();
    acceptAndSubmitTransaction();
});

// Scenario: Selected plan reverts to lead offer when customer goes back before the payment step
Then(/^they select the term upsell offer and submit the payment form$/, () => {
    selectTermUpsellAndSubmitPaymentForm();
});
Then(/^they should land on the review step$/, () => {
    cy.url().should('contain', '/review');
});
Then(/^when they navigate back to the payment step$/, () => {
    cy.go('back');
});
Then(/^the term upsell offer should be selected$/, () => {
    cy.get('[data-test="upsellOptionTermOffer"] [data-test="radioOptionCardWithRadioSelectFormField"]:checked').should('exist');
});
Then(/^when they go back to the previous step and then proceed forward$/, () => {
    cy.go('back');
    clickContinueOnPaymentInterstitial();
});
Then(/^the lead offer should be selected in the upsell form$/, () => {
    cy.get('[data-test="upsellOptionLeadOffer"] [data-test="radioOptionCardWithRadioSelectFormField"]:checked').should('exist');
});

// Scenario: Consumption logic works when selected offer is the upsell offer
Then(/^they select the upsell offer$/, () => {
    cy.get('[data-test="upsellOptionTermOffer"]').click();
});
