import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell,
    stubOffersCustomerSuccessSatellitePromoSelfPayWithTermUpsellOnly,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubAccountNonPiiSatelliteTargetedWithTrialAndActiveCc, stubAccountVerifySuccess } from '../../../../../support/stubs/de-microservices/account';
import { agreeAndSubmitReview, selectExistingCcAndContinue } from '../common-utils/ui';
import { stubDeviceValidateUsedSuccess } from '../../../../../support/stubs/de-microservices/device';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import {
    stubQuotesQuotePromoSelfPayFiveMonthsDiscountThenBasePrice,
    stubQuotesQuotePromoSelfPayPackageAndTermUpgrade,
    stubQuotesQuotePromoSelfPaySixMonthsDiscountThenBasePrice,
    stubQuotesQuotePromoSelfPayTermUpgradeTwelveMonths,
    stubQuotesQuotePromoSelfPayXmPlatinumPackageUpgrade,
} from '../../../../../support/stubs/de-microservices/quotes';
import { stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration } from '../../../../../support/stubs/de-microservices/purchase';

Before(() => {
    cy.viewport('iphone-x');
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteTargetedWithTrialAndActiveCc();
    stubAccountVerifySuccess();
});

Given(/^a customer visits the targeted satellite purchase experience with an upcode for a package and term upsell$/, () => {
    // URL with Parameters for lead offer with package and term upsell
    cy.visit(`/subscribe/checkout?programcode=6FOR30SELECT&upcode=A6FOR30SELECT&radioid=8L2100MW&act=9042`);
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();
});
When(/^they go through the targeted satellite purchase steps up to the upsell step$/, () => {
    selectExistingCcAndContinue();
});
Then(/^they should be presented with the package and term upsell options$/, () => {
    cy.get('[data-test="packageSatelliteUpgradeCardFormFieldCheckbox"]').first().should('be.visible');
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().should('be.visible');
});

Given(/^a customer visits the targeted satellite purchase experience with an upcode for a term upsell only$/, () => {
    cy.visit(`/subscribe/checkout?programcode=5FOR25SELECT&upcode=A12FOR99SELECT&radioid=DHT0004U&act=1605`);
    stubOffersCustomerSuccessSatellitePromoSelfPayWithTermUpsellOnly();
});
When(/^they go through the targeted satellite purchase steps up to the upsell step for upsell only$/, () => {
    selectExistingCcAndContinue();
});
Then(/^they should be presented with the term upsell option only$/, () => {
    cy.get('[data-test="packageSatelliteUpgradeCardFormFieldCheckbox"]').should('not.exist');
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().should('be.visible');
});

Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});

When(/^they go through the targeted satellite purchase steps without selecting an upsell and complete the transaction$/, () => {
    // (1)
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPaySixMonthsDiscountThenBasePrice();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (2) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (3) Review & Submit
    agreeAndSubmitReview();
});

When(/^they go through the targeted satellite purchase steps without selecting a term only upsell and complete the transaction$/, () => {
    // (1)
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayFiveMonthsDiscountThenBasePrice();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (2) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (3) Review & Submit
    agreeAndSubmitReview();
});

When(/^they go through the targeted satellite purchase steps and select the package upsell and complete the transaction$/, () => {
    // (1)
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayXmPlatinumPackageUpgrade();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (2) Select package upsell for XM Premium
    cy.get('[data-test="packageSatelliteUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (3) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (4) Review & Submit
    agreeAndSubmitReview();
});

When(/^they go through the targeted satellite purchase steps and select the term upsell and complete the transaction$/, () => {
    // (1)
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayTermUpgradeTwelveMonths();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (2) Select term upsell
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (3) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (4) Review & Submit
    agreeAndSubmitReview();
});

When(/^they go through the targeted satellite purchase steps and select the package and term upsell and complete the transaction$/, () => {
    // (1)
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayPackageAndTermUpgrade();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (2) Select package and term upgrade
    cy.get('[data-test="packageSatelliteUpgradeCardFormFieldCheckbox"]').first().click({ force: true });
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (3) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (4) Review & Submit
    agreeAndSubmitReview();
});

When(/^they go through the targeted satellite purchase steps and select the term only upsell and complete the transaction$/, () => {
    // (1)
    selectExistingCcAndContinue();

    stubQuotesQuotePromoSelfPayTermUpgradeTwelveMonths();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubUtilitySecurityQuestionsSuccess();

    // (2) Select term upsell
    cy.get('[data-test="packageTermUpgradeCardFormFieldCheckbox"]').first().click({ force: true });

    // (3) Continue without selecting any upsells
    cy.get('[data-test="offerUpsell.continueButton"]').first().click({ force: true });

    // (4) Review & Submit
    agreeAndSubmitReview();
});
