import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubCustomerOffersSelfPayPromoLoad } from './common-utils/stubs';
import { stubAccountTokenClosedDeviceCardOnFile, stubAccountNonPiiSatelliteTargetedWithTrialSubscription } from '../../../../../support/stubs/de-microservices/account';
import {
    stubOffersUpsellInfoSatelliteTargetedSelfPayPromoPackageAndTerm,
    stubOffersUpsellSatelliteTargetedSelfPayPromoPackageAndTermAsUpsellCall,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubDeviceValidateNewSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
});

// Scenario: Experience loads self pay promo correctly for targeted customer via radio id and account number
When(/^a customer visits the satellite accordion targeted flow for a self pay promo with a valid radio id and account number$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription();
    stubCustomerOffersSelfPayPromoLoad();
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?RadioID=CNT0008V&programcode=6FOR30SELECT&act=10000207275`);
    cy.wait(['@offersCall']);
});

// Scenario: Experience loads self pay promo correctly for targeted customer via radio id and account number and upcode
When(/^a customer visits the satellite accordion targeted flow for a self pay promo with a valid radio id and account number and upcode$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription();
    stubCustomerOffersSelfPayPromoLoad();
    stubOffersUpsellSatelliteTargetedSelfPayPromoPackageAndTermAsUpsellCall();
    stubOffersUpsellInfoSatelliteTargetedSelfPayPromoPackageAndTerm();
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?RadioID=CNT0008V&programcode=6FOR50AA&upcode=6FOR50AA&act=10000207275`);
    cy.wait(['@offersCall']);
});
Then(/^they should be presented with upsell offers$/, () => {
    // The offer data is loaded asynchronously so we need to wait for the offer calls to complete
    cy.wait(['@upsellCall']);
    cy.get('[data-test="accordion-upgrades-step"]').should('be.visible');
});

//Scenario: Experience loads self pay promo correctly for targeted customer with a closed radio via token
When(/^a customer visits the satellite accordion targeted flow with a token for a self pay promo$/, () => {
    stubAccountTokenClosedDeviceCardOnFile();
    stubCustomerOffersSelfPayPromoLoad();
    cy.visit(`/subscribe/checkout/purchase/satellite/targeted?tkn=387f04de-16e1-4be7-9e81-cb378f5986ee&programcode=6FOR30SELECT`);
});
Then(/^they should land on the confirmation page$/, () => {
    cy.get('[data-test="ReviewQuoteAndApproveFormSubmitButton"]').click();
    cy.url().should('contain', '/thanks');
});
