import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountNonPiiNoAccountWithMarketingId, stubAccountNonPiiSatelliteTargetedWithTrialSubscription } from '../../../../../support/stubs/de-microservices/account';
import { stubDeviceValidateNewSuccess, stubDeviceValidateRadioIdNotFound } from '../../../../../support/stubs/de-microservices/device';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer,
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall,
    stubOffersRenewalSatelliteTargetedNoOffers,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfo500, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    cy.viewport('iphone-x');
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

// Common steps
Then(/^they should be redirected to the legacy targeted checkout experience$/, () => {
    cy.url().should('contain', '/subscribe/checkout');
    cy.url().should('not.contain', '/subscribe/checkout/flepz');
});

// Scenario: Customer is redirected to legacy targeted checkout experience when url contains an upcode
When(/^a customer visits the targeted satellite purchase experience with an upcode in the url$/, () => {
    stubSuccessfulSatelliteTargetedAccountAndOfferLoad();
    cy.visit('/subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&radioid=06R0004A&act=10000257273&upcode=INVALID');
});

// Scenario: Customer is redirected to legacy targeted checkout experience when url contains an promocode
When(/^a customer visits the targeted satellite purchase experience with an promocode in the url$/, () => {
    stubSuccessfulSatelliteTargetedAccountAndOfferLoad();
    cy.visit('/subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&radioid=06R0004A&act=10000257273&promocode=INVALID');
});

// Scenario: Customer is redirected to organic checkout experience when account not found
When(/^a customer without an account visits the targeted satellite purchase experience$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiNoAccountWithMarketingId();
    cy.visit('/subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&radioid=06R0004A&act=INVALID');
});
Then(/^they should be redirected to the organic checkout experience$/, () => {
    cy.url().should('contain', '/subscribe/checkout/flepz');
});

// Scenario: Customer is redirected to the generic satellite error page when using an invalid radio id
When(/^a customer without an invalid radio id visits the targeted satellite purchase experience$/, () => {
    stubDeviceValidateRadioIdNotFound();
    cy.visit('/subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&radioid=INVALID&act=10000257273');
});
Then(/^they should be redirected to the generic satellite error page$/, () => {
    cy.url().should('contain', '/subscribe/checkout/purchase/satellite/generic-error');
});

// Scenario: Customer is redirected to the global error page when a system error occurs
When(/^a customer visits the targeted satellite purchase experience and the env info service returns a 500$/, () => {
    stubUtilityEnvInfo500();
    cy.visit('/subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&radioid=06R0004A&act=10000257273');
});
Then(/^they should be redirected to the general error page$/, () => {
    cy.url().should('contain', '/error');
});

const stubSuccessfulSatelliteTargetedAccountAndOfferLoad = () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiSatelliteTargetedWithTrialSubscription();
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer();
    stubOffersRenewalSatelliteTargetedNoOffers();
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall();
};
