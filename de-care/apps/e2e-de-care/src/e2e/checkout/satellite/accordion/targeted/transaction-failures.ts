import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { agreeAndSubmitReview, goThroughTargetedStepsUpToReviewStepForClosedRadio } from '../common-utils/ui';
import { stubCustomerOffersSelfPayPromoLoad } from './common-utils/stubs';
import { stubAccountTokenClosedDeviceCardOnFile } from '../../../../../support/stubs/de-microservices/account';
import {
    stubPurchaseAddSubscriptionSatelliteTargetedCcFraudError,
    stubPurchaseAddSubscriptionSatelliteTargetedEligibleForRegistration,
    stubPurchaseAddSubscriptionSatelliteTargetedSystemError,
} from '../../../../../support/stubs/de-microservices/purchase';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubValidateUniqueLoginSuccess } from '../../../../../support/stubs/de-microservices/validate';

Before(() => {
    cy.viewport('iphone-x');
});

// Common steps
When(/^a customer visits the satellite accordion targeted flow with a token for a self pay promo and closed radio$/, () => {
    stubAccountTokenClosedDeviceCardOnFile();
    stubCustomerOffersSelfPayPromoLoad();
    cy.visit(`/subscribe/checkout?tkn=387f04de-16e1-4be7-9e81-cb378f5986ee&programcode=6FOR30SELECT`);
});

// Scenario: Customer should get a credit card error for expired cc on the payment step after transaction submission for closed radio
Then(/^they go through the targeted satellite purchase steps with an invalid credit card expiration for closed radio$/, () => {
    goThroughTargetedStepsUpToReviewStepForClosedRadio();
    stubPurchaseAddSubscriptionSatelliteTargetedCcFraudError();
    stubValidateUniqueLoginSuccess();
    agreeAndSubmitReview();
});
Then(/^they should be able to complete the transaction if they update to a valid credit card$/, () => {
    cy.get('[data-test="CCCardNumberTextfieldMasked"]').click();
    goThroughTargetedStepsUpToReviewStepForClosedRadio();
    stubPurchaseAddSubscriptionSatelliteTargetedEligibleForRegistration();
    stubValidateUniqueLoginSuccess();
    stubUtilitySecurityQuestionsSuccess();
    cy.get('[data-test="reviewOrder.completeButton"]').click();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});

// Scenario: Customer should get a general system error on the payment step after transaction submission for closed radio
Then(/^they go through the targeted satellite purchase steps and a system error occurs on purchase transaction for closed radio$/, () => {
    goThroughTargetedStepsUpToReviewStepForClosedRadio();
    stubPurchaseAddSubscriptionSatelliteTargetedSystemError();
    stubValidateUniqueLoginSuccess();
    agreeAndSubmitReview();
});
Then(/^they should be taken back to the payment step and shown an auth error message in the credit card section$/, () => {
    cy.get('[data-test="AuthErrorMessage"]').should('be.visible');
});
