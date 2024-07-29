import {
    stubAccountStreamingNonAccordionTargetedFullPriceStreamingNotRegistered,
    stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtdTrialSubscription,
    stubAccountTokenStreamingNonAccordionTargetedSingleDigitalSelfPaySubscription,
} from '../../../../../../support/stubs/de-microservices/account';
import {
    stubOffersCustomerAddStreamingNonAccordionTargetedMultiRadioDiscount,
    stubOffersCustomerAddStreamingNonAccordionTargetedStreamingMrd,
    stubOffersCustomerStreamingNonAccordionTargetedEssentialStreamingMonthly,
    stubOffersInfoStreamingNonAccordionTargetedAddStreamingMrd,
    stubOffersInfoStreamingNonAccordionTargetedEssentialStreamingMonthly,
    stubOffersInfoStreamingNonAccordionTargetedMultiRadioDiscount,
} from '../../../../../../support/stubs/de-microservices/offers';

export const stubAccountLoadAndOffersForMrd = () => {
    stubAccountTokenStreamingNonAccordionTargetedSingleDigitalSelfPaySubscription();
    stubOffersCustomerAddStreamingNonAccordionTargetedMultiRadioDiscount();
    stubOffersInfoStreamingNonAccordionTargetedMultiRadioDiscount();
};

export const stubAccountLoadAndOffersForAddStreamingMrd = () => {
    stubAccountStreamingNonAccordionTargetedFullPriceStreamingNotRegistered();
    stubOffersCustomerAddStreamingNonAccordionTargetedStreamingMrd();
    stubOffersInfoStreamingNonAccordionTargetedAddStreamingMrd();
};

export const stubAccountLoadAndOffersForRtd = () => {
    stubAccountTokenStreamingNonAccordionTargetedSingleDigitalRtdTrialSubscription();
    stubOffersCustomerStreamingNonAccordionTargetedEssentialStreamingMonthly();
    stubOffersInfoStreamingNonAccordionTargetedEssentialStreamingMonthly();
};
