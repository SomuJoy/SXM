import { getCheckoutState, getActiveOrClosedRadioIdOnAccount } from '@de-care/checkout-state';
import { createSelector } from '@ngrx/store';
import { selectRegisterWidgetState } from '../reducer/reducer';
import { getMaskedPhoneNumber as getMaskedPhoneNumberFromPurchaseState } from '@de-care/purchase-state';

export const getCheckoutAccountState = createSelector(getCheckoutState, (checkout) => checkout.account);

export const getVerificationOptionsStatus = createSelector(selectRegisterWidgetState, (state) => state?.verificationOptionsStatus || null);

export const getVerificationMethods = createSelector(selectRegisterWidgetState, (state) => state?.verificationMethods || null);

export const getVerificationOptionsAvailable = createSelector(
    getVerificationOptionsStatus,
    getVerificationMethods,
    (verificationOptionsStatus, methods) => (!verificationOptionsStatus?.inProgress && !verificationOptionsStatus?.hasError && methods !== null) || false
);

export const getCanUseRadioId = createSelector(getVerificationMethods, (methods) => methods?.radioId.eligible && !methods?.radioId.verified);
export const getCanUseAccountNumber = createSelector(getVerificationMethods, (methods) => methods?.accountNumber.eligible && !methods?.accountNumber.verified);
export const getCanUsePhone = createSelector(getVerificationMethods, (methods) => methods?.phone.eligible && !methods?.phone.verified);
export const getCanUseEmail = createSelector(getVerificationMethods, (methods) => methods?.email.eligible && !methods?.email.verified);

// TODO Determine how to get the maskedPhoneNumber
export const getMaskedPhoneNumber = createSelector(getMaskedPhoneNumberFromPurchaseState, (maskedPhoneNumber) => maskedPhoneNumber);

export const getLast4DgititsSelectedRadioId = createSelector(getActiveOrClosedRadioIdOnAccount, (radioId) => radioId);

export const getTwoFactorAuthData = createSelector(
    getVerificationOptionsAvailable,
    getMaskedPhoneNumber,
    getCanUseRadioId,
    getCanUseAccountNumber,
    getCanUsePhone,
    getLast4DgititsSelectedRadioId,
    getCanUseEmail,
    (isAvailable, maskedPhoneNumber, canUseRadioId, canUseAccountNumber, canUsePhone, last4DigitisRadioId, canUseEmail) =>
        isAvailable
            ? {
                  verifyOptionsInfo: {
                      maskedPhoneNumber,
                      canUseRadioId,
                      canUseAccountNumber,
                      canUsePhone,
                      canUseEmail,
                  },
                  last4DigitisRadioId,
              }
            : null
);
