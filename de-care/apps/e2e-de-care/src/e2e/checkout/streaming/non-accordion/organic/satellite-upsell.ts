import { Then, Before, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLookupSuccess, stubCaptchaNotRequired, stubPaymentInfoSuccess } from '../../common-utils/stubs';
import { stubTransactionSuccess } from '../common-utils/stubs';
import {
    acceptAndSubmitTransaction,
    clickContinueOnCredentialsInterstitial,
    clickContinueOnOfferPresentment,
    clickContinueOnPaymentInterstitial,
    fillOutAndSubmitAccountLookupForm,
    fillOutAndSubmitPaymentInfoForm,
    visitCheckoutOrganicWithAllowedProgramCodeAndSatupcode,
} from '../common-utils/ui';
import { stubOffersCustomerSuccessDigitalRtpFree, stubOffersSuccessDigitalRtpFree } from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingNonAccordionOrganicSuccess } from '../../../../../support/stubs/de-microservices/quotes';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalRtpFree();
});

// Scenario: Customer can purchase offer
When('a customer goes through the organic streaming purchase steps with a valid program code and valid satupcode', () => {
    visitCheckoutOrganicWithAllowedProgramCodeAndSatupcode();
    cy.wait('@offersInfo');
    clickContinueOnOfferPresentment();
    cy.wait(1000);
    clickContinueOnCredentialsInterstitial();
    stubAccountLookupSuccess();
    stubOffersCustomerSuccessDigitalRtpFree();
    fillOutAndSubmitAccountLookupForm();
    clickContinueOnPaymentInterstitial();
    //stubOfferAndSatelliteAddCardUpsell();
    stubPaymentInfoSuccess();
    stubCaptchaNotRequired();
    stubQuotesQuoteStreamingNonAccordionOrganicSuccess();
    fillOutAndSubmitPaymentInfoForm();
    stubTransactionSuccess();
    acceptAndSubmitTransaction();
});
Then('they should be able to see the satellite upsell ui', () => {
    cy.get('sxm-ui-add-car-subscription-card').should('be.visible');
    cy.get('listen-now-inline').should('be.visible');
});
