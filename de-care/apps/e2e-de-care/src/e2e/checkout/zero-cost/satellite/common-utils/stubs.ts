import { stubAccountNonPiiZeroCostSatelliteOrganicSuccess } from '../../../../../support/stubs/de-microservices/account';
import {
    stubPurchaseTrialAccountNewAccountZeroCostSatelliteOrganicUsernameError,
    stubPurchaseTrialAccountNewAccountZeroCostSatelliteOrganicUsernameInUseError,
    stubPurchaseTrialActivationNewAccountZeroCostSatelliteOrganicSuccess,
    stubPurchaseTrialActivationNewAccountZeroCostSatelliteOrganicSystemError,
} from '../../../../../support/stubs/de-microservices/purchase';
import { stubOffersCustomerZeroCostSatelliteOrganicSuccess, stubOffersInfoZeroCostSatelliteOrganicSuccess } from '../../../../../support/stubs/de-microservices/offers';
import { stubUtilitySecurityQuestionsSuccess } from '../../../../../support/stubs/de-microservices/utility';
import { stubValidateCustomerInfoAddressAutoCorrectSuccess } from '../../../../../support/stubs/de-microservices/validate';

export const stubOrganicCustomerOffersSuccess = () => {
    stubOffersCustomerZeroCostSatelliteOrganicSuccess();
    stubOffersInfoZeroCostSatelliteOrganicSuccess();
};
export const stubOrganicAccountInfoSuccess = () => {
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    stubPurchaseTrialActivationNewAccountZeroCostSatelliteOrganicSuccess();
    stubAccountNonPiiZeroCostSatelliteOrganicSuccess();
    stubUtilitySecurityQuestionsSuccess();
};
export const stubOrganicAccountInfoSystemError = () => {
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    stubPurchaseTrialActivationNewAccountZeroCostSatelliteOrganicSystemError();
};
export const stubOrganicAccountInfoUsernameError = () => {
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    stubPurchaseTrialAccountNewAccountZeroCostSatelliteOrganicUsernameError();
};
export const stubOrganicAccountInfoUsernameInUseError = () => {
    stubValidateCustomerInfoAddressAutoCorrectSuccess();
    stubPurchaseTrialAccountNewAccountZeroCostSatelliteOrganicUsernameInUseError();
};
