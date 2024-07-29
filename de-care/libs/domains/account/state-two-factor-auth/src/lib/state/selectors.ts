import { SxmLanguages } from '@de-care/app-common';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, TwoFactorAuthState } from './reducer';
import { AccountVerificationStatusEnum } from '../data-services/verify-account.service';
import { RadioIdVerificationStatusEnum } from '../data-services/verify-radio-id.service';

const selectTwoFactorAuthFeature = createFeatureSelector<TwoFactorAuthState>(featureKey);

export const getIncludeChatWithAnAgentLink = createSelector(getLanguage, lang => (lang as SxmLanguages) === 'en-CA');

export const getVerifyTypeSelection = createSelector(selectTwoFactorAuthFeature, getIncludeChatWithAnAgentLink, (state, includeChatWithAgentLink) => ({
    ...state.verifyTypeSelection,
    includeChatWithAgentLink
}));

export const getAccountVerificationStatus = createSelector(selectTwoFactorAuthFeature, state => state.accountVerificationStatus);
export const getAccountIsInvalid = createSelector(getAccountVerificationStatus, state => state === AccountVerificationStatusEnum.invalid);
export const getRadioIdVerificationStatus = createSelector(selectTwoFactorAuthFeature, state => state.radioIdVerificationStatus);
export const getRadioIdIsInvalid = createSelector(getRadioIdVerificationStatus, state => state === RadioIdVerificationStatusEnum.invalid);

export const getIsPendingSecurityCodeVerification = createSelector(selectTwoFactorAuthFeature, state => state.isPendingSecurityCodeVerification);
export const getAccountNumber = createSelector(selectTwoFactorAuthFeature, state => state.accountNumber);

export const getPhoneMatchesAccount = createSelector(selectTwoFactorAuthFeature, state => state.phoneMatchesAccount);
export const getPhoneVerificationRequestComplete = createSelector(selectTwoFactorAuthFeature, state => state.phoneVerificationRequestComplete);

export const getPhoneVerificationRequestCodeStatus = createSelector(selectTwoFactorAuthFeature, state => state.phoneVerificationRequestCodeStatus);
export const getPhoneVerificationRequestCodeSuccessful = createSelector(getPhoneVerificationRequestCodeStatus, status => status === 'success');
export const getPhoneVerificationRequestCodeFailure = createSelector(getPhoneVerificationRequestCodeStatus, status => status === 'failure');
export const getPhoneVerificationRequestCodeError = createSelector(getPhoneVerificationRequestCodeStatus, status => status === 'error');
export const getPhoneVerificationRequestCodeLimitExceeded = createSelector(getPhoneVerificationRequestCodeStatus, status => status === 'limitExceeded');
export const getResendHasBeenRequested = createSelector(selectTwoFactorAuthFeature, state => state.resendCodeRequested);
