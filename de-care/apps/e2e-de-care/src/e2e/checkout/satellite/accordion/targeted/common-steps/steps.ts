import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubPurchaseAddSubscriptionSatelliteTargetedEligibleForRegistration } from '../../../../../../support/stubs/de-microservices/purchase';
import { stubCheckEligibilityCaptchaNotRequiredSuccess } from '../../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteSatelliteTargetedSatellitePromoSelfPay } from '../../../../../../support/stubs/de-microservices/quotes';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../../support/stubs/de-microservices/utility';
import { stubValidateUniqueLoginSuccess } from '../../../../../../support/stubs/de-microservices/validate';

// Common
Then(/^they should be presented with the correct offer$/, () => {
    // The offer data is loaded asynchronously so we need to wait for the offer calls to complete
    cy.wait(['@offersInfoCall']);
    cy.primaryPackageCardIsVisibleAndContains('Music & Entertainment');
});
Then(/^they should see their device information$/, () => {
    cy.get('[data-test="DeviceDetailsRadioInfo"]').should('be.visible');
});

// Scenario: Can complete checkout with a closed radio via token
Then(/^they go through the targeted satellite purchase steps$/, () => {
    cy.get('[data-test="PaymentInfoExistingCard"]').click();
    stubQuotesQuoteSatelliteTargetedSatellitePromoSelfPay();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    cy.get('[data-test="PaymentConfirmationButton"]').click();

    cy.get('[data-test="ChargeMyCardText"]').click();
    stubPurchaseAddSubscriptionSatelliteTargetedEligibleForRegistration();
    stubValidateUniqueLoginSuccess();
    stubUtilitySecurityQuestionsSuccess();
});
