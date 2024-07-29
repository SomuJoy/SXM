import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountLookupExistingSingleTrial, stubPaymentInfoSuccess } from '../../common-utils/stubs';
import {
    clickContinueOnCredentialsInterstitial,
    clickContinueOnOfferPresentment,
    clickContinueOnPaymentInterstitial,
    fillOutAndSubmitAccountLookupForm,
    fillOutAndSubmitIdentificationValidateLpzForm,
    fillOutPaymentBasicInfoWithPhoneAndZipFormAndSubmit,
    visitCheckoutOrganicWithAllowedProgramCode,
} from '../common-utils/ui';
import { stubAccountNonPiiStreamingNonAccordionOrganicTrialSubscriptionSuccess } from '../../../../../support/stubs/de-microservices/account';
import { stubIdentityCustomerEmailSuccess } from '../../../../../support/stubs/de-microservices/identity';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCheckEligibilityStreamingCommonSuccess,
    stubOffersCustomerStreamingNonAccordionOrganicEssentialStreamingMonthly,
    stubOffersSuccessDigitalEssentialStreamingMonthly,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteStreamingNonAccordionTargetedEssentialStreamingMonthly } from '../../../../../support/stubs/de-microservices/quotes';

Before(() => {
    cy.viewport('iphone-x');
    stubOffersSuccessDigitalEssentialStreamingMonthly();
});

When('a trial customer goes through the organic streaming purchase steps with a valid program code', () => {
    visitCheckoutOrganicWithAllowedProgramCode();
    clickContinueOnOfferPresentment();
    clickContinueOnCredentialsInterstitial();
    stubIdentityCustomerEmailSuccess();
    stubAccountLookupExistingSingleTrial();
    fillOutAndSubmitAccountLookupForm();
    stubAccountNonPiiStreamingNonAccordionOrganicTrialSubscriptionSuccess();
    clickContinueOnPaymentInterstitial();
});

Then('lpz Modal is presented and the user continues to next step successfully', () => {
    cy.get('sxm-ui-modal identification-validate-lpz-form').should('be.visible');
    stubOffersCustomerStreamingNonAccordionOrganicEssentialStreamingMonthly();
    fillOutAndSubmitIdentificationValidateLpzForm();
    cy.get('step-organic-payment-page').should('be.visible');
});

Then('user is able to complete the transaction', () => {
    stubOffersCheckEligibilityStreamingCommonSuccess();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubQuotesQuoteStreamingNonAccordionTargetedEssentialStreamingMonthly();
    stubPaymentInfoSuccess();
    fillOutPaymentBasicInfoWithPhoneAndZipFormAndSubmit();
});
