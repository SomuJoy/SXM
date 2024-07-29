import { stubAccountChangeSubscriptionTargetedExistingSatelliteSubscription } from '../../../../../support/stubs/de-microservices/account';
import { stubOffersCustomerChangeTargetedMultiple, stubOffersInfoChangeSubscriptionTargetedMultiple } from '../../../../../support/stubs/de-microservices/offers';

export const stubChangeSubscriptionTargetedToken = () => {
    stubAccountChangeSubscriptionTargetedExistingSatelliteSubscription();
    stubOffersCustomerChangeTargetedMultiple();
    stubOffersInfoChangeSubscriptionTargetedMultiple();
};
