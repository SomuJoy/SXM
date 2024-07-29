import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell,
    stubOffersCustomerSuccessSatellitePromoSelfPayWithTermUpsellOnly,
    stubOffersSuccessSatellitePromoSelfPay,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubDeviceValidateUsedSuccess } from '../../../../../support/stubs/de-microservices/device';
import { stubAccountNonPiiSatelliteOrganicWithTrialSubscription, stubAccountVerifySuccess } from '../../../../../support/stubs/de-microservices/account';
import {
    stubQuotesQuotePromoSelfPayFiveMonthsDiscountThenBasePrice,
    stubQuotesQuotePromoSelfPayPackageAndTermUpgrade,
    stubQuotesQuotePromoSelfPaySixMonthsDiscountThenBasePrice,
    stubQuotesQuotePromoSelfPayTermUpgradeTwelveMonths,
    stubQuotesQuotePromoSelfPayXmPlatinumPackageUpgrade,
} from '../../../../../support/stubs/de-microservices/quotes';
import { stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration } from '../../../../../support/stubs/de-microservices/purchase';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { agreeAndSubmitReview, enterAndSubmitLPZ, enterAndSubmitRadioIdLookup, selectExistingCcAndContinue } from '../common-utils/ui';

Before(() => {
    stubOffersSuccessSatellitePromoSelfPay();
    cy.viewport('iphone-x');
});

Given(/^a customer visits the organic satellite purchase experience with an upcode for a package and term upsell$/, () => {
    // URL with Parameters for lead offer with package and term upsell
    cy.visit(`/subscribe/checkout/flepz?programcode=6FOR30SELECT&upcode=A6FOR30SELECT`);
});

Given(/^a customer visits the organic satellite purchase experience with an upcode for a term upsell$/, () => {
    // URL with parameters for lead offer with term upsell only
    cy.visit(`/subscribe/checkout/flepz?programcode=5FOR25SELECT&upcode=A12FOR99SELECT`);
});

Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});

// Scenario: Customer is presented with the package and term upsell options
When(/^they go through the organic satellite purchase steps up to the upsell step$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Lookup radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();

    // (2) Verify Account
    enterAndSubmitLPZ();

    // (3) Select existing payment and continue
    selectExistingCcAndContinue();
});
Then(/^they should be presented with the package and term upsell options$/, () => {
    cy.get('[data-test="packageSatelliteUpgradeCardFormFieldCheckbox"]').first().should('be.visible');
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().should('be.visible');
});

// Scenario: Customer is presented with the term upsell option
When(/^they go through the organic satellite purchase steps up to the term only upsell step$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Lookup radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithTermUpsellOnly();

    // (2) Verify Account
    enterAndSubmitLPZ();

    // (3) Select existing payment and continue
    selectExistingCcAndContinue();
});
Then(/^they should be presented with the term upsell option$/, () => {
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().should('be.visible');
});

// Scenario: Customer can purchase lead offer when presented package and term upsell offers
When(/^they go through the organic satellite purchase steps without selecting an upsell and complete the transaction$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Look up device by radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();

    // (2) Verify account
    enterAndSubmitLPZ();

    // (3) Select existing credit card
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPaySixMonthsDiscountThenBasePrice();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (4) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (5) Review & Submit
    agreeAndSubmitReview();
});

// Scenario: Customer can purchase lead offer when presented term upsell offer
When(/^they go through the organic satellite purchase steps without selecting a term only upsell and complete the transaction$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Lookup radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithTermUpsellOnly();

    // (2) Verify Account
    enterAndSubmitLPZ();

    // (3) Select existing payment and continue
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayFiveMonthsDiscountThenBasePrice();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (4) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (5) Review & Submit
    agreeAndSubmitReview();
});

// Scenario: Customer can purchase a package upgrade when presented package and term upsell offers
When(/^they go through the organic satellite purchase steps and select the package upsell and complete the transaction$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Look up device by radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();

    // (2) Verify account
    enterAndSubmitLPZ();

    // (3) Select existing credit card
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayXmPlatinumPackageUpgrade();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (4) Select package upsell for XM Premium
    cy.get('[data-test="packageSatelliteUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (5) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (6) Review & Submit
    agreeAndSubmitReview();
});

// Scenario: Customer can purchase a term upgrade when presented package and term upsell offers
When(/^they go through the organic satellite purchase steps and select the term upsell and complete the transaction$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Look up device by radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();

    // (2) Verify account
    enterAndSubmitLPZ();

    // (3) Select existing credit card
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayTermUpgradeTwelveMonths();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (4) Select term upsell
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (5) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (6) Review & Submit
    agreeAndSubmitReview();
});

// Scenario: Customer can purchase a package and term upgrade when presented package and term upsell offers
When(/^they go through the organic satellite purchase steps and select the package and term upsell and complete the transaction$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Look up device by radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();

    // (2) Verify account
    enterAndSubmitLPZ();

    // (3) Select existing credit card
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayPackageAndTermUpgrade();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (4) Select package and term upgrade
    cy.get('[data-test="packageSatelliteUpgradeCardFormFieldCheckbox"]').first().click({ force: true });
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (5) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (6) Review & Submit
    agreeAndSubmitReview();
});

// Scenario: Customer can purchase a term upgrade when presented a term upsell offer
When(/^they go through the organic satellite purchase steps with term upsell only and select the term upsell and complete the transaction$/, () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();

    // (1) Lookup radio id
    enterAndSubmitRadioIdLookup();

    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithTermUpsellOnly();

    // (2) Verify Account
    enterAndSubmitLPZ();

    // (3) Select existing payment and continue
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayTermUpgradeTwelveMonths();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (4) Select term upsell
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (5) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (6) Review & Submit
    agreeAndSubmitReview();
});
