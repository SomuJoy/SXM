import { Before, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
    stubAccountNonPiiSatelliteTargetedClosedRadioWithDuplicateYmm,
    stubAccountNonPiiSatelliteTargetedClosedRadioWithNickname,
    stubAccountNonPiiSatelliteTargetedClosedRadioWithNoNicknameOrYmm,
    stubAccountNonPiiSatelliteTargetedClosedRadioWithYmm,
} from '../../../../../support/stubs/de-microservices/account';
import {
    stubAllPackageDescriptionsSuccess,
    stubOffersCustomerSatelliteTargetedMcp5for12Offer,
    stubOffersInfoSatelliteTargetedMcp5for12Offer,
    stubOffersRenewalSatelliteTargetedNoOffers,
} from '../../../../../support/stubs/de-microservices/offers';
import { stubApiGatewayUpdateUseCaseSuccess } from '../../../../../support/stubs/de-microservices/apigateway';
import { stubUtilityCardBinRangesSuccess, stubUtilityEnvInfoSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubDeviceValidateNewSuccess } from '../../../../../support/stubs/de-microservices/device';

Before(() => {
    cy.viewport('iphone-x');
    stubUtilityEnvInfoSuccess();
    stubUtilityCardBinRangesSuccess();
    stubAllPackageDescriptionsSuccess();
    stubApiGatewayUpdateUseCaseSuccess();
    stubDeviceValidateNewSuccess();
});

//Helper functions
const stubCustomerOffersAndSiteVisit = () => {
    stubOffersCustomerSatelliteTargetedMcp5for12Offer();
    stubOffersRenewalSatelliteTargetedNoOffers();
    stubOffersInfoSatelliteTargetedMcp5for12Offer();
    cy.visit(`subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&act=0188&radioid=990005225055`);
};
//Common
Then(/^they should see the Vehicle Info Component$/, () => {
    cy.wait(['@accountCall']);
    cy.get('[data-test="VehicleInfoComponent"]').should('exist');
});

// Scenario: Vehicle Info Component loads correctly for targeted customer who has a nickname on their subscription
When(/^a customer with a nickname on their subscription visits the satellite non-accordion targeted flow$/, () => {
    stubAccountNonPiiSatelliteTargetedClosedRadioWithNickname();
    stubCustomerOffersAndSiteVisit();
});
Then(/^only their nickname should be displayed$/, () => {
    cy.get('[data-test="VehicleInfoComponentNickName"]').should('be.visible');
    cy.get('[data-test="VehicleInfoComponentYMM"]').should('not.exist');
    cy.get('[data-test="VehicleInfoComponentRadioId"]').should('not.exist');
});
// Scenario: Vehicle Info Component loads correctly for targeted customer who has YMM Info on their vehicle
When(/^a customer with YMM and no nickname visits the satellite non-accordion targeted flow$/, () => {
    stubAccountNonPiiSatelliteTargetedClosedRadioWithYmm();
    stubCustomerOffersAndSiteVisit();
});
Then(/^only their YMM should be displayed$/, () => {
    cy.get('[data-test="VehicleInfoComponentNickName"]').should('not.exist');
    cy.get('[data-test="VehicleInfoComponentYMM"]').should('be.visible');
    cy.get('[data-test="VehicleInfoComponentRadioId"]').should('not.exist');
});
// Scenario: Vehicle Info Component loads correctly for targeted customer who has two vehicles with the same YMM Info
When(/^a customer with duplicate YMM's and no nickname visits the satellite non-accordion targeted flow$/, () => {
    stubAccountNonPiiSatelliteTargetedClosedRadioWithDuplicateYmm();
    stubCustomerOffersAndSiteVisit();
});
Then(/^both their YMM and radioId should displayed$/, () => {
    cy.get('[data-test="VehicleInfoComponentNickName"]').should('not.exist');
    cy.get('[data-test="VehicleInfoComponentYMM"]').should('be.visible');
    cy.get('[data-test="VehicleInfoComponentRadioId"]').should('be.visible');
});
// Scenario: Vehicle Info Component loads correctly for targeted customer who has no nickname or YMM Info
When(/^a customer with no nickname or ymm info visits the satellite non-accordion targeted flow$/, () => {
    stubAccountNonPiiSatelliteTargetedClosedRadioWithNoNicknameOrYmm();
    stubCustomerOffersAndSiteVisit();
});
Then(/^only their masked radioId should be displayed$/, () => {
    cy.get('[data-test="VehicleInfoComponentNickName"]').should('not.exist');
    cy.get('[data-test="VehicleInfoComponentYMM"]').should('not.exist');
    cy.get('[data-test="VehicleInfoComponentRadioId"]').should('be.visible');
});
