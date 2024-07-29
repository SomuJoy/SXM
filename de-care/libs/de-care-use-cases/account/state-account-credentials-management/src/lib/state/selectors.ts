import { getTwoFactorAuthData, getVerificationOptionsAvailable } from '@de-care/domains/account/state-register-widget';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';
import { createSelector } from '@ngrx/store';
import { selectSetupCredentialsFeatureState } from './reducer';
import { getLanguagePrefix } from '@de-care/domains/customer/state-locale';

export const getQueryParams = createSelector(getNormalizedQueryParams, (queryParams) => queryParams);

export const getSrcQueryParam = createSelector(getNormalizedQueryParams, (queryParam) => {
    if (queryParam?.src) {
        return queryParam?.src;
    } else if (queryParam?.source) {
        return queryParam?.source;
    } else {
        return 'organic';
    }
});

export const getSrcQueryParamMultiple = createSelector(getSrcQueryParam, (src) => {
    if (src === 'oac' || src === 'sclogin') {
        return 'oac';
    } else if (
        src === 'player' ||
        src === 'everestplayer' ||
        src === 'alexa' ||
        src === 'google' ||
        src === 'stitcher' ||
        src === 'nugs' ||
        src === 'profileportal' ||
        src === 'onboarding' ||
        src === 'streaming'
    ) {
        return 'streaming';
    } else {
        return 'organic';
    }
});

export const getLanguages = createSelector(getLanguagePrefix, (lang) => lang);

export const getAllAccounts = createSelector(selectSetupCredentialsFeatureState, (state) => state?.account || null);

export const getQueryParamsWithoutSource = createSelector(getNormalizedQueryParams, (queryParams) => {
    if (queryParams?.src) {
        delete queryParams.src;
    }
    if (queryParams?.source) {
        delete queryParams.source;
    }
    if (queryParams?.src2) {
        delete queryParams.src2;
    }
    return queryParams;
});

export const getResetPasswordUsername = createSelector(selectSetupCredentialsFeatureState, (state) => state?.userName);

export const getInboundQueryParamsPasswordResetToken = createSelector(getNormalizedQueryParams, (queryParams) =>
    queryParams?.tkn ? queryParams?.tkn : queryParams?.updatepwdtoken
);

export const getVerificationOptionsAvailableAndTwoFactorAuthData = createSelector(
    getVerificationOptionsAvailable,
    getTwoFactorAuthData,
    (verificationOptionsAvailable, twoFactorAuthData) => ({ verificationOptionsAvailable, twoFactorAuthData })
);

export const getAccountDataBySource = createSelector(getAllAccounts, (accounts) => {
    if (accounts) {
        accounts = accounts.map((x) => ({ ...x, canUsePhone: false, canUseEmail: false, accountType: '', subscription: [] }));
        return accounts;
    }
});

export const getEmailSentMaskedEmailId = createSelector(selectSetupCredentialsFeatureState, (state) => state?.maskedEmailId);

export const getSelectedAccount = createSelector(selectSetupCredentialsFeatureState, (state) => state?.selectedAccount);
export const getOrganicSelectedAccountType = createSelector(selectSetupCredentialsFeatureState, (state) => state?.organicAccountType);
export const getResetToken = createSelector(selectSetupCredentialsFeatureState, (state) => state?.resetToken);
export const getResetPasswordAccountType = createSelector(selectSetupCredentialsFeatureState, (state) => state?.tokenAccountType);
export const getTokenValidation = createSelector(selectSetupCredentialsFeatureState, (state) => state?.isTokenInvalid);
export const getMaskedPhoneNumber = createSelector(selectSetupCredentialsFeatureState, (state) => state?.maskedPhoneNumber);
export const getUpdatePasswordAccountType = createSelector(getQueryParams, (state) => state?.type);
export const getIsUsernameSameAsEmail = createSelector(selectSetupCredentialsFeatureState, (state) => state?.isUsernameSameAsemail);
export const getIsRecoverUsernameFlow = createSelector(selectSetupCredentialsFeatureState, (state) => state?.isRecoverUsernameFlow);
export const getIsThirdPartyLinkingVendorIdSonos = createSelector(getNormalizedQueryParams, (queryParams) => queryParams?.thirdpartylinkingvendorid === 'sonos');

export const getUserEnteredEmailOrUsername = createSelector(selectSetupCredentialsFeatureState, (state) => state.userEnteredEmailOrUsername);
export const getIsCredentialRecoveryFlow = createSelector(selectSetupCredentialsFeatureState, (data) => data.isCredentialRecoveryFlow);
export const getUserEnteredEmailAndLastname = createSelector(selectSetupCredentialsFeatureState, (state) => state.userEnteredEmail && state.userEnteredLastname);
