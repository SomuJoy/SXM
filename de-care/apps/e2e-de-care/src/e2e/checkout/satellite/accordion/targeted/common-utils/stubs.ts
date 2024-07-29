import {
    stubOffersCustomerSatelliteTargetedRollToChoice,
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer,
    stubOffersInfoSatelliteTargetedRollToChoiceAsOffersInfoCall,
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall,
    stubOffersRenewalSatelliteTargetedNoOffers,
    stubOffersRenewalSatelliteTargetedRollToChoice,
} from '../../../../../../support/stubs/de-microservices/offers';

//Helper functions
export const stubCustomerOffersSelfPayPromoLoad = () => {
    stubOffersCustomerSatelliteTargetedSelfPayPromoOffer();
    stubOffersRenewalSatelliteTargetedNoOffers();
    stubOffersInfoSatelliteTargetedSelfPayPromoOfferAsOffersInfoCall();
};

export const stubCustomerOffersRollToChoiceLoad = () => {
    stubOffersCustomerSatelliteTargetedRollToChoice();
    stubOffersRenewalSatelliteTargetedRollToChoice();
    stubOffersInfoSatelliteTargetedRollToChoiceAsOffersInfoCall();
};
