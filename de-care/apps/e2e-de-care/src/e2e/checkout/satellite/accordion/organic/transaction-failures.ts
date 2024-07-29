import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { agreeAndSubmitReview, enterAndSubmitLPZ, enterAndSubmitRadioIdLookup, goThroughOrganicStepsUpToReviewStepForClosedRadio } from '../common-utils/ui';
import { stubAccountNonPiiSatelliteOrganicWithTrialSubscription, stubAccountVerifySuccess } from '../../../../../support/stubs/de-microservices/account';
import {
    stubPurchaseChangeSubscriptionSatelliteOrganicCcFraudError,
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration,
    stubPurchaseChangeSubscriptionSatelliteOrganicSystemError,
    stubPurchaseNewAccountSatelliteOrganicCcFraudError,
    stubPurchaseNewAccountSatelliteOrganicSystemError,
} from '../../../../../support/stubs/de-microservices/purchase';
import {
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell,
    stubOffersSuccessSatellitePromoSelfPay,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteSatelliteOrganicPromoSelfPay } from '../../../../../support/stubs/de-microservices/quotes';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubValidateUniqueLoginSuccess } from '../../../../../support/stubs/de-microservices/validate';
import { stubDeviceValidateUsedSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    stubOffersSuccessSatellitePromoSelfPay();
    cy.viewport('iphone-x');
});

// Common
When(/^a customer visits the organic satellite purchase flow$/, () => {
    cy.visit(`/subscribe/checkout/flepz?programcode=6FOR30SELECT`);
});

// Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission for existing radio
Then(/^they go through the organic satellite purchase steps with an invalid credit card expiration for existing radio$/, () => {
    goThroughStepsUpToReviewStepForExistingRadio();
    stubPurchaseChangeSubscriptionSatelliteOrganicCcFraudError();
    agreeAndSubmitReview();
});
Then(/^they should be able to complete the transaction if they update to a valid credit card$/, () => {
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    cy.get('[data-test="CCCardNumberTextfieldMasked"]').click();
    fillOutBillingStep();
    stubPurchaseChangeSubscriptionSatelliteOrganicEligibleForRegistration();
    stubValidateUniqueLoginSuccess();
    stubUtilitySecurityQuestionsSuccess();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});

// Scenario: Customer should get a general system error on the payment step after transaction submission for existing radio
Then(/^they go through the organic satellite purchase steps and a system error occurs on purchase transaction for existing radio$/, () => {
    goThroughStepsUpToReviewStepForExistingRadio();
    stubPurchaseChangeSubscriptionSatelliteOrganicSystemError();
    agreeAndSubmitReview();
});

// Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission for closed radio
Then(/^they go through the organic satellite purchase steps with an invalid credit card expiration for closed radio$/, () => {
    goThroughOrganicStepsUpToReviewStepForClosedRadio();
    stubPurchaseNewAccountSatelliteOrganicCcFraudError();
    agreeAndSubmitReview();
});

// Scenario: Customer should get a general system error on the payment step after transaction submission for closed radio
Then(/^they go through the organic satellite purchase steps and a system error occurs on purchase transaction for closed radio$/, () => {
    goThroughOrganicStepsUpToReviewStepForClosedRadio();
    stubPurchaseNewAccountSatelliteOrganicSystemError();
    agreeAndSubmitReview();
});

const goThroughStepsUpToReviewStepForExistingRadio = () => {
    lookupRadioIdWithExistingTrialAndValidate();
    stubQuotesQuoteSatelliteOrganicPromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    fillOutBillingStep();
};

const lookupRadioIdWithExistingTrialAndValidate = () => {
    stubDeviceValidateUsedSuccess();
    stubAccountNonPiiSatelliteOrganicWithTrialSubscription();
    enterAndSubmitRadioIdLookup();
    stubAccountVerifySuccess();
    stubOffersCustomerSuccessSatellitePromoSelfPayWithPackageAndTermUpsell();
    enterAndSubmitLPZ();
};

const fillOutBillingStep = () => {
    cy.intercept('POST', '**/services/validate/customer-info', { fixture: 'de-microservices/validate/customer-info/satellite-organic_payment-success.json' });
    enterAndSubmitBillingInfoUsingNewCard();
};
const enterAndSubmitBillingInfoUsingNewCard = () => {
    cy.get('[data-test="PaymentInfoNewCard"]').click();
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCAddress"]').clear({ force: true }).type('1234 Home Street', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCCity"]').clear({ force: true }).type('Schenectady', { force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCState"]').contains('NY').click({ force: true });
    cy.get('[data-test="billingAddressFormFields"] [data-test="CCZipCode"]').clear({ force: true }).type('12345', { force: true });
    cy.get('[data-test="CCNameOnCardTextfield"]').clear().type('Jane Test');
    cy.get('[data-test="CCCardNumberTextfield"]').clear().type('4111111111111111');
    cy.get('[data-test="ccExpDateOnCardTextfield"]').clear({ force: true }).type('0235', { force: true });
    cy.get('[data-test="ccCVV"]').clear().type('123');
    cy.get('[data-test="PaymentConfirmationButton"]').click();
};
