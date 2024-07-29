import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountUpgradeVipSatelliteCommonWithOneNonVipPlan } from '../../../../../support/stubs/de-microservices/account';
import { stubPurchaseChangeSubscriptionSatelliteCommonRegistrationAndStreamingEligible } from '../../../../../support/stubs/de-microservices/purchase';
import {
    stubAllPackageDescriptionsSuccess,
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSuccessSatellitePlatinumVIP,
    stubOffersSuccessSatellitePlatinumVIP,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubQuotesQuoteSatelliteCommonUpgradeVipOneRadio } from '../../../../../support/stubs/de-microservices/quotes';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilitySecurityQuestionsSuccess, stubUtilityCardBinRangesSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubDeviceValidateUsedSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubOffersSuccessSatellitePlatinumVIP();
    cy.viewport('iphone-x');
});

// Common steps
When(/^a customer visits the upgrade vip organic page with a valid program code$/, () => {
    cy.visit(`/subscribe/upgrade-vip/flepz?tbView=DM&programcode=PLTOFFERVIP`);
});

// Scenario: Experience loads VIP offer
Then(/^they should be presented with the VIP offer$/, () => {
    cy.primaryPackageCardIsVisibleAndContains('SiriusXM Platinum VIP');
});

// Scenario: Customer can upgrade to a VIP offer without selecting a second plan
Then(/^they lookup an account that does not have an active VIP subscription$/, () => {
    cy.get('[data-test="sxmUIRadioIdFormField"]').clear().type('6EQ01812');
    cy.get('[data-test="sxmUIAccountNumberFormField"]').clear().type('10000242904');
    stubDeviceValidateUsedSuccess();
    stubAccountUpgradeVipSatelliteCommonWithOneNonVipPlan();
    stubOffersCustomerSuccessSatellitePlatinumVIP();
    cy.get('[data-test="RadioAndAccountLookupForm.submitButton"]').click();
    cy.get('[data-e2e="accountLookupStepModal.submitButton"]').click();
});
Then(/^they choose to add a second radio later$/, () => {
    cy.get('[data-test="firstStepForm.addSecondRadioLater"]').click();
    cy.get('[data-test="firstStepForm.continueButton"]').click();
    cy.get('[data-test="areYouSureModal.submitButton"]').click();
});
Then(/^they complete the payment and review steps$/, () => {
    // Payment info
    stubQuotesQuoteSatelliteCommonUpgradeVipOneRadio();
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    cy.get('[data-test="UseExistingCardText"]').click();
    cy.get('[data-test="PaymentConfirmationButton"]').click();
    // Review step
    stubPurchaseChangeSubscriptionSatelliteCommonRegistrationAndStreamingEligible();
    stubUtilitySecurityQuestionsSuccess();
    cy.get('[data-test="ChargeMyCardText"]').click();
    cy.get('[data-test="UpgradeVIPOrganic.ConfirmReviewAndSubmitButton"]').click();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', 'subscribe/upgrade-vip/thanks');
});
