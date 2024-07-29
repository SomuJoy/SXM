import { createSelector } from '@ngrx/store';
import { selectFlepzData, selectInboundQueryParams, selectSelectedSubscription, selectSuggestedRegistrationServiceAddressCorrections } from './selectors';
import { streamingFlepzLookupSubscriptionsAsArray } from '@de-care/domains/identity/state-streaming-flepz-lookup';

export {
    selectFlepzData,
    selectInvalidEmailError,
    selectInvalidFirstNameError,
    clearInvalidEmailError,
    clearInvalidFirstNameError,
    getStreamingPlayerLinkTokenInfoViewModel,
    getAllAccounts,
    getQueryParams,
    getSrcQueryParam,
    getResetPasswordAccountType,
    getUpdatePasswordUsername,
    getInboundQueryParamsPasswordResetToken,
    getAccountDataBySource,
    getEmailSentMaskedEmailId,
    getSelectedAccount,
    getResetPasswordUsername,
    getResetToken,
    getMaskedPhoneNumber,
    getTokenValidation,
    getUpdatePasswordAccountType,
    getIsUsernameSameAsEmail,
    getIsRecoverUsernameFlow,
    getUserEnteredEmailOrUsername,
    getIsCredentialRecoveryFlow,
    getUserEnteredEmailAndLastname,
} from './selectors';
export const getFlepzEmail = createSelector(selectFlepzData, (flepzData) => flepzData?.email);
export const transactionSessionFlepzSubmittedDataExists = createSelector(selectFlepzData, (flepzData) => !!flepzData);

export { getSecurityQuestions as getSecurityQuestionsViewModel } from '@de-care/domains/account/state-security-questions';
export { getAccountIsInPreTrial, getEmailId } from '@de-care/domains/account/state-account';

export const registrationServiceAddressSuggestionsViewModel = createSelector(selectSuggestedRegistrationServiceAddressCorrections, (data) => ({
    correctedAddresses: Array.isArray(data?.correctedAddresses) ? data?.correctedAddresses : [],
    addressCorrectionAction: data?.addressCorrectionAction,
}));
export const registrationServiceAddressSuggestionIsAvsValidated = createSelector(
    selectSuggestedRegistrationServiceAddressCorrections,
    (data) => data?.correctedAddressIsAvsValidated
);

export const getInboundQueryParamsAsString = createSelector(selectInboundQueryParams, (inboundQueryParams) => {
    let queryParamsAsString = '';
    Object.keys(inboundQueryParams).forEach((key, index) => {
        if (index > 0) {
            queryParamsAsString += '&';
        }
        queryParamsAsString += `${key}=${inboundQueryParams[key]}`;
    });
    return queryParamsAsString;
});

export const selectFlepzSubscriptionsFoundSummaryViewModel = createSelector(streamingFlepzLookupSubscriptionsAsArray, (subscriptions) =>
    subscriptions.map((subscription) => mapSubscriptionSummary(subscription))
);

export const selectSelectedSubscriptionSummaryViewModel = createSelector(selectSelectedSubscription, (subscription) =>
    subscription ? mapSubscriptionSummary(subscription) : null
);

function mapSubscriptionSummary(subscription) {
    return {
        last4DigitsOfAccountNumber: subscription.last4DigitsOfAccountNumber,
        last4DigitsOfRadioId: subscription.radioService?.last4DigitsOfRadioId,
        vehicleInfo: minimalVehicleInfoExists(subscription.radioService?.vehicleInfo) ? subscription.radioService?.vehicleInfo : null,
        packageNames: subscription.plans?.map((plan) => plan.packageName),
        eligibilityType: subscription.eligibilityType,
        email: subscription?.email?.toLowerCase(),
    };
}

function minimalVehicleInfoExists({ year, make, model }: { year: string | number; make: string; model: string }): boolean {
    return !!year || !!make || !!model;
}
