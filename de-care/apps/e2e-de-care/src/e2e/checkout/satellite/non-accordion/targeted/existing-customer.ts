import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription } from '../../../../../support/stubs/de-microservices/account';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubDeviceValidateNewSuccess } from '../../../../../support/stubs/de-microservices/device';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer,
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall,
    stubOffersRenewalSatelliteTargetedNoOffers,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';

Before(() => {
    cy.viewport('iphone-x');
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
});

// Scenario: Customer with existing self pay subscription
When(/^a customer visits the targeted satellite purchase experience with a radio id that has an existing self pay subscription$/, () => {
    stubDeviceValidateNewSuccess();
    stubAccountNonPiiSatelliteOrganicWithSelfPaySubscription();
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer();
    stubOffersRenewalSatelliteTargetedNoOffers();
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall();
    cy.visit('/subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&radioid=06R0000K&act=10000257273');
});
Then(/^they should be redirected to the active subscription page$/, () => {
    cy.url().should('contain', '/subscribe/checkout/purchase/satellite/targeted/active-subscription');
});
