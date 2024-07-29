import { Action, createReducer, on } from '@ngrx/store';
import {
    clearPaymentInfo,
    clearPlanCode,
    clearPurchaseFlowData,
    clearTermType,
    setChangeTermOnlyModeOn,
    setLoadReviewOrderDataAsNotProcessing,
    setLoadReviewOrderDataAsProcessing,
    setSubmitChangeSubscriptionDataAsProcessing,
    setSubmitChangeSubscriptionDataAsNotProcessing,
    setPaymentInfo,
    setPlanCode,
    setTermType,
    setToNotUseCardOnFile,
    setToUseCardOnFile,
    setPackageSelectionIsprocessing,
    setPackageSelectionIsNotprocessing,
    setPackageSelectionIsDowngrade,
    setPackageSelectionIsNotDowngrade,
    setPaymentInfoCountry,
    setSubscriptionId,
    setInfotainmentPlanCodes,
    setChangeSubscriptionOffersError,
    setTokenMode,
    setMarketingPromoCode,
    clearMarketingPromoCode,
    setSelectedSubscriptionIDForSAL,
    setTransactionId,
    setIsRefreshAllowed,
} from './actions';

export type TermType = 'monthly' | 'annual' | null;
export interface PaymentInfo {
    billingAddress: PaymentAddress;
    serviceAddress?: PaymentAddress;
    ccExpDate: string;
    ccName: string;
    ccNum: string;
    country?: string;
}

export interface PaymentAddress {
    addressLine1: string;
    city: string;
    state: string;
    zip: string;
}

export interface SelectedPackageWarning {
    downgrade: boolean;
    promotionLoss: boolean;
    packageDifferences: string[];
}

export const featureKey = 'changeSubscriptionPurchase';
export interface ChangeSubscriptionPurchaseState {
    changeTermOnlyMode: boolean;
    planCode: string;
    marketingPromoCode: string;
    infotainmentPlanCodes: string[];
    termType: TermType;
    useCardOnFile: boolean;
    paymentInfo: PaymentInfo;
    subscriptionId: number;
    loadReviewOrderDataIsProcessing: boolean;
    submitChangeSubscriptionDataIsProcessing: boolean;
    packageSelectionIsprocessing: boolean;
    packageSelectionIsDowngrade: boolean;
    changeSubscriptionOffersError: string;
    isTokenMode: boolean;
    selectedSubscriptionIDForSAL: string;
    transactionId: string;
    isRefreshAllowed?: boolean;
}

export const initialState: ChangeSubscriptionPurchaseState = {
    changeTermOnlyMode: false,
    planCode: null,
    marketingPromoCode: null,
    infotainmentPlanCodes: [],
    termType: null,
    useCardOnFile: false,
    paymentInfo: null,
    subscriptionId: null,
    loadReviewOrderDataIsProcessing: false,
    submitChangeSubscriptionDataIsProcessing: false,
    packageSelectionIsprocessing: false,
    packageSelectionIsDowngrade: false,
    changeSubscriptionOffersError: null,
    isTokenMode: false,
    selectedSubscriptionIDForSAL: null,
    transactionId: null,
    isRefreshAllowed: true,
};

const stateReducer = createReducer(
    initialState,
    on(clearPurchaseFlowData, (state) => ({ ...state, planCode: null, termType: null, useCardOnFile: false })),
    on(setPlanCode, (state, { planCode }) => ({ ...state, planCode })),
    on(setMarketingPromoCode, (state, { marketingPromoCode }) => ({ ...state, marketingPromoCode })),
    on(clearMarketingPromoCode, (state) => ({ ...state, marketingPromoCode: null })),
    on(clearPlanCode, (state) => ({ ...state, planCode: null })),
    on(setTermType, (state, { termType }) => ({ ...state, termType })),
    on(clearTermType, (state) => ({ ...state, termType: null })),
    on(setToUseCardOnFile, (state) => ({ ...state, useCardOnFile: true })),
    on(setToNotUseCardOnFile, (state) => ({ ...state, useCardOnFile: false })),
    on(setPaymentInfo, (state, { paymentInfo }) => ({ ...state, paymentInfo })),
    on(setSubscriptionId, (state, { subscriptionId }) => ({ ...state, subscriptionId })),
    on(setTokenMode, (state, { isTokenMode }) => ({ ...state, isTokenMode })),
    on(setPaymentInfoCountry, (state, { country }) => ({
        ...state,
        paymentInfo: {
            ...state.paymentInfo,
            country,
        },
    })),
    on(clearPaymentInfo, (state) => ({ ...state, paymentInfo: null })),
    on(setChangeTermOnlyModeOn, (state) => ({ ...state, changeTermOnlyMode: true })),
    on(setLoadReviewOrderDataAsProcessing, (state) => ({ ...state, loadReviewOrderDataIsProcessing: true })),
    on(setLoadReviewOrderDataAsNotProcessing, (state) => ({ ...state, loadReviewOrderDataIsProcessing: false })),
    on(setSubmitChangeSubscriptionDataAsProcessing, (state) => ({ ...state, submitChangeSubscriptionDataIsProcessing: true })),
    on(setSubmitChangeSubscriptionDataAsNotProcessing, (state) => ({ ...state, submitChangeSubscriptionDataIsProcessing: false })),
    on(setPackageSelectionIsprocessing, (state) => ({ ...state, packageSelectionIsprocessing: true })),
    on(setPackageSelectionIsNotprocessing, (state) => ({ ...state, packageSelectionIsprocessing: false })),
    on(setPackageSelectionIsDowngrade, (state) => ({ ...state, packageSelectionIsDowngrade: true })),
    on(setPackageSelectionIsNotDowngrade, (state) => ({ ...state, packageSelectionIsDowngrade: false })),
    on(setInfotainmentPlanCodes, (state, { planCodes }) => ({ ...state, infotainmentPlanCodes: planCodes })),
    on(setChangeSubscriptionOffersError, (state, { error }) => ({ ...state, changeSubscriptionOffersError: error })),
    on(setTransactionId, (state, { transactionId }) => ({ ...state, transactionId })),
    on(setSelectedSubscriptionIDForSAL, (state, { selectedSubscriptionIDForSAL }) => ({ ...state, selectedSubscriptionIDForSAL })),
    on(setIsRefreshAllowed, (state, { isRefreshAllowed }) => ({ ...state, isRefreshAllowed: isRefreshAllowed }))
);

export function reducer(state: ChangeSubscriptionPurchaseState, action: Action) {
    return stateReducer(state, action);
}
