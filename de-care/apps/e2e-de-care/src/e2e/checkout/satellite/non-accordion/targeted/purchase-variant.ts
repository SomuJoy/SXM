import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubPurchaseChangeSubscriptionSatelliteCommonRegistrationAndStreamingEligible } from '../../../../../support/stubs/de-microservices/purchase';
import { stubValidateUniqueLoginSuccess } from '../../../../../support/stubs/de-microservices/validate';
import { stubAccountNonPiiSatelliteTargetedWithTrialSubscription } from '../../../../../support/stubs/de-microservices/account';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import {
    stubAllPackageDescriptionsSuccess,
    stubCheckEligibilityCaptchaNotRequiredSuccess,
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer,
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall,
    stubOffersRenewalSatelliteTargetedNoOffers,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess, stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubDeviceValidateNewSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Common steps
Given(/^a customer visits the satellite targeted flow with a valid radio id and account number$/, () => {
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription();
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer();
    stubOffersRenewalSatelliteTargetedNoOffers();
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall();
    cy.visit(`subscribe/checkout/purchase/satellite/targeted/offer?programcode=MCP5FOR12&act=0188&radioid=990005225055`);
    cy.wait(['@offersInfoCall']);
});

// Scenario: Experience loads offer correctly for targeted customer via radio id and account number
Then(/^they should be presented with the correct offer$/, () => {
    cy.primaryPackageCardIsVisibleAndContains('XM Music & Entertainment');
});

// Scenario: Can complete checkout with a radio id and account number
When(/^they go through the targeted satellite purchase steps$/, () => {
    cy.get('[data-test="continueButton"]').click();

    cy.intercept('POST', '**/services/quotes/quote', { fixture: 'de-microservices/quotes/quote/satellite-targeted_satellite-promo-self-pay.json' });
    stubCheckEligibilityCaptchaNotRequiredSuccess();
    cy.get('[data-test="PaymentInfoExistingCard"]').click();
    cy.get('[data-test="PaymentConfirmationButton"]').click();

    stubPurchaseChangeSubscriptionSatelliteCommonRegistrationAndStreamingEligible();
    stubValidateUniqueLoginSuccess();
    stubUtilitySecurityQuestionsSuccess();
    cy.get('[data-test="chargeAgreementFormField"]').click({ force: true });
    cy.get('[data-test="ReviewQuoteAndApproveFormSubmitButton"]').click();
});
Then(/^they should land on the confirmation page$/, () => {
    cy.url().should('contain', '/thanks');
});
