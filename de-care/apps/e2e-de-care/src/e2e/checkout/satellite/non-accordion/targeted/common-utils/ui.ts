import {
    stubOffersCustomerSatelliteTargetedMcp5for12Offer,
    stubOffersInfoSatelliteTargetedMcp5for12Offer,
    stubOffersRenewalSatelliteTargetedNoOffers,
} from '../../../../../../support/stubs/de-microservices/offers';

export const stubCustomerOffersAndSiteVisit = () => {
    stubOffersCustomerSatelliteTargetedMcp5for12Offer();
    stubOffersRenewalSatelliteTargetedNoOffers();
    stubOffersInfoSatelliteTargetedMcp5for12Offer();
    cy.visit(`subscribe/checkout/purchase/satellite/targeted/new?programcode=MCP5FOR12&act=0188&radioid=990005225055`);
};
