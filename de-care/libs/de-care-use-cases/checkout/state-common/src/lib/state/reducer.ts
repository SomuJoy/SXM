import { Action, createReducer, on } from '@ngrx/store';
import {
    clearCustomerInfo,
    clearNuCaptchaRequired,
    clearPaymentInfo,
    setCustomerInfo,
    setNuCaptchaRequired,
    setSelectedPlanCode,
    setSelectedProvinceCode,
    clearCheckoutCommonTransactionState,
    setUserEnteredCredentials,
    clearUserEnteredPassword,
    setAllowLicensePlateLookup,
    clearPaymentInfoCvv,
    clearUserEnteredUsername,
    setIsRefreshAllowed,
} from './public.actions';
import {
    clearPaymentMethodUseCardOnFile,
    collectAllInboundQueryParams,
    setPaymentInfoWithCardType,
    setPaymentMethodUseCardOnFile,
    setTransactionIdForSession,
} from './actions';

export const featureKey = 'checkoutCommon';

export interface CheckoutCommonState {
    inboundQueryParams?: { [key: string]: string };
    transactionIdForSession: string | null;
    selectedPlanCode: string | null;
    userEnteredCredentials: {
        email?: string;
        password?: string;
        userName?: string;
    };
    customerInfo?: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    paymentInfo?: {
        serviceAddress?: {
            addressLine1?: string;
            city?: string;
            state?: string;
            zip?: string;
            country?: string;
            avsValidated?: boolean;
        };
        billingAddress?: {
            addressLine1?: string;
            city?: string;
            state?: string;
            zip?: string;
            country?: string;
            avsValidated?: boolean;
        };
        nameOnCard?: string;
        cardNumber?: string | number;
        cardExpirationDate?: string;
        cvv?: string;
        giftCard?: string;
        cardType?: string | null;
    };
    useCardOnFile: boolean;
    nuCaptchaRequired: boolean;
    selectedProvinceCode?: string;
    allowLicensePlateLookup?: boolean;
    isRefreshAllowed?: boolean;
}
const initialState: CheckoutCommonState = {
    userEnteredCredentials: {},
    transactionIdForSession: null,
    selectedPlanCode: null,
    useCardOnFile: false,
    nuCaptchaRequired: false,
    allowLicensePlateLookup: true,
    isRefreshAllowed: true,
};

const stateReducer = createReducer(
    initialState,
    on(collectAllInboundQueryParams, (state, { inboundQueryParams }) => ({ ...state, inboundQueryParams: { ...state.inboundQueryParams, ...inboundQueryParams } })),
    on(setTransactionIdForSession, (state, { transactionIdForSession }) => ({ ...state, transactionIdForSession })),
    on(setSelectedPlanCode, (state, { planCode }) => ({ ...state, selectedPlanCode: planCode })),
    on(setCustomerInfo, (state, { customerInfo }) => ({ ...state, customerInfo: { ...customerInfo } })),
    on(clearCustomerInfo, (state) => ({ ...state, customerInfo: undefined })),
    on(setPaymentInfoWithCardType, (state, { paymentInfo }) => ({
        ...state,
        paymentInfo: {
            ...(paymentInfo.serviceAddress && { serviceAddress: paymentInfo.serviceAddress }),
            ...(paymentInfo.billingAddress && { billingAddress: paymentInfo.billingAddress }),
            nameOnCard: paymentInfo.nameOnCard,
            cardNumber: paymentInfo.cardNumber,
            cardExpirationDate: paymentInfo.cardExpirationDate,
            cvv: paymentInfo.cvv,
            giftCard: paymentInfo.giftCard,
            cardType: paymentInfo.cardType,
        },
    })),
    on(clearPaymentInfo, (state) => ({ ...state, paymentInfo: undefined })),
    on(setPaymentMethodUseCardOnFile, (state) => ({ ...state, useCardOnFile: true })),
    on(clearPaymentMethodUseCardOnFile, (state) => ({ ...state, useCardOnFile: false })),
    on(setNuCaptchaRequired, (state) => ({ ...state, nuCaptchaRequired: true })),
    on(clearNuCaptchaRequired, (state) => ({ ...state, nuCaptchaRequired: false })),
    on(setSelectedProvinceCode, (state, { provinceCode }) => ({ ...state, selectedProvinceCode: provinceCode })),
    on(setAllowLicensePlateLookup, (state, { allowLicensePlateLookup }) => ({ ...state, allowLicensePlateLookup: allowLicensePlateLookup })),
    on(clearCheckoutCommonTransactionState, (state) => initialState),
    on(setUserEnteredCredentials, (state, { type, ...userEnteredCredentials }) => ({ ...state, userEnteredCredentials })),
    on(clearUserEnteredPassword, (state) => ({ ...state, userEnteredCredentials: { ...state.userEnteredCredentials, password: undefined } })),
    on(setIsRefreshAllowed, (state, { isRefreshAllowed }) => ({ ...state, isRefreshAllowed: isRefreshAllowed })),
    on(clearPaymentInfoCvv, (state) => {
        if (state.paymentInfo?.cvv) {
            return {
                ...state,
                paymentInfo: {
                    ...state.paymentInfo,
                    cvv: '',
                },
            };
        }
        return state;
    }),
    on(clearUserEnteredUsername, (state) => ({ ...state, userEnteredCredentials: { ...state.userEnteredCredentials, userName: undefined } }))
);

export function reducer(state: CheckoutCommonState, action: Action) {
    return stateReducer(state, action);
}
