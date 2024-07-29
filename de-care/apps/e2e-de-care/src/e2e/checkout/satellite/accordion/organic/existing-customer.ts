import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
    agreeAndSubmitReview,
    enterAndSubmitLicensePlateLookup,
    enterAndSubmitRadioIdLookup,
    enterAndSubmitVin,
    fillOutFlepzForm,
    selectExistingCcAndContinue,
    submitFlepzForm,
} from '../common-utils/ui';
import {
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription,
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription,
} from '../../../../../support/stubs/de-microservices/account';
import {
    stubIdentityCustomerFlepzSatelliteOrganicActiveSelfPay,
    stubIdentityCustomerFlepzSatelliteOrganicActiveSelfPayAndTrial,
    stubIdentityCustomerFlepzSatelliteOrganicMultipleActiveSelfPay,
    stubIdentityDeviceLicensePlateFound,
} from '../../../../../support/stubs/de-microservices/identity';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSatelliteOrganicDefaultSelfPayOffersCustomerSuccess,
    stubOffersInfoSatelliteOrganicDefaultSpecialUpgradeInfoSuccess,
    stubOffersRenewalSatelliteDefaultSelfPayRenewalsSuccess,
    stubOffersSuccessSatelliteOrganicDefaultOfferSelfPay,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubDeviceValidateUsedSuccess } from '../../../../../support/stubs/de-microservices/device';
import { stubQuotesQuoteDefaultSelfPayFinalQuote } from '../../../../../support/stubs/de-microservices/quotes';
import { stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration } from '../../../../../support/stubs/de-microservices/purchase';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    stubOffersSuccessSatelliteOrganicDefaultOfferSelfPay();
    cy.viewport('iphone-x');
});

// Common steps
Given(/^a customer visits the organic satellite purchase flow$/, () => {
    cy.visit(`/subscribe/checkout/flepz`);
});
Then(/^they should be presented with the subscription found modal with a single subscription$/, () => {
    cy.get('[data-test="ActiveSubscriptionFoundModalContent"]').should('be.visible');
});
Then(/^they should be presented with the devices found modal with multiple devices$/, () => {
    cy.get('[data-test="DeviceInfoFoundHeadline"]').should('be.visible');
    cy.get('[data-test="ActivePlanInfo"]').its('length').should('be.gt', 1);
});
Then(/^they should be able to select the trial and purchase a self pay subscription$/, () => {
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    stubOffersCustomerSatelliteOrganicDefaultSelfPayOffersCustomerSuccess();
    stubOffersRenewalSatelliteDefaultSelfPayRenewalsSuccess();
    stubOffersInfoSatelliteOrganicDefaultSpecialUpgradeInfoSuccess();

    // (2) Continue button proceeds to purchasing self pay from trial
    cy.get('[data-test="ChooseRadioBtn"]').first().click({ force: true });

    stubQuotesQuoteDefaultSelfPayFinalQuote();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (3) Select existing payment and continue
    selectExistingCcAndContinue();

    // (4) Review & Submit
    agreeAndSubmitReview();
    cy.url().should('contain', '/thanks');
});

// Scenario: Customer with single satellite subscription using radio id lookup
When(/^they use a radio id with a single self pay satellite subscription$/, () => {
    // Look up device by radio id
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription();
    enterAndSubmitRadioIdLookup();
});

// Scenario: Customer with single satellite subscription using flepz lookup
When(/^they use flepz data with a single self pay satellite subscription$/, () => {
    // Look up device by flepz
    stubDeviceValidateUsedSuccess();
    stubIdentityCustomerFlepzSatelliteOrganicActiveSelfPay();
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription();
    cy.get('#account-info').click(); // NOTE - we don't have a data-test attribute here because it will require some hefty verify device info component refactor
    fillOutFlepzForm();
    submitFlepzForm();
});

// Scenario: Customer with single satellite subscription using radio id lookup
When(/^they use VIN data with a single self pay satellite subscription$/, () => {
    // Look up device by VIN
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription();
    enterAndSubmitVin();
});

// Scenario: Customer with single satellite subscription using license plate lookup
When(/^they use license plate data with a single self pay satellite subscription$/, () => {
    // Look up device by license plate
    stubIdentityDeviceLicensePlateFound();
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription();
    enterAndSubmitLicensePlateLookup();
});

// Scenario: Customer with single satellite subscription using radio id lookup
When(/^they use flepz data with a multiple self pay satellite subscriptions$/, () => {
    // Look up multiple subscription devices by flepz info
    stubIdentityCustomerFlepzSatelliteOrganicMultipleActiveSelfPay();
    cy.get('#account-info').click();
    fillOutFlepzForm();
    submitFlepzForm();
});

// Scenario: Customer with single satellite subscription using radio id lookup
When(/^they use flepz lookup with a self pay satellite subscription and a trial subscription$/, () => {
    // (1) flepz lookup with active subscription and trial
    stubIdentityCustomerFlepzSatelliteOrganicActiveSelfPayAndTrial();
    cy.get('#account-info').click();
    fillOutFlepzForm();
    submitFlepzForm();
});
