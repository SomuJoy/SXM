import { Action, createReducer, on } from '@ngrx/store';
import {
    setCancelReason,
    setSubscriptionId,
    setCancelOnlyModeOn,
    setPlanCode,
    setPaymentInfo,
    clearPaymentInfo,
    setToUseCardOnFile,
    setToNotUseCardOnFile,
    setLoadReviewOrderDataAsProcessing,
    setLoadReviewOrderDataAsNotProcessing,
    setCancellationDetails,
    setWillBeCancelledLaterToTrue,
    setSubmitChangeSubscriptionDataAsProcessing,
    setSubmitChangeSubscriptionDataAsNotProcessing,
    setTransactionId,
    setCurrentUTCDayHour,
    setSelectedPackageNameFromOfferGrid,
    setCancelByChatAllowed,
    setPreselectedPlanIsEnabled,
    setPlanIsSelectedFromGrid,
    resetPlanIsSelectedFromGrid,
    setIsRefreshAllowed,
} from './actions';

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

export interface CancellationDetails {
    cancellationNumber: string;
    refundAmount: number;
    creditRemainingOnAccount: number;
    amountDue: number;
}

export interface CurrentUTCDayHour {
    day: number;
    hour: number;
}

export const featureKey = 'cancelSubscriptionRequest';
export interface CancelSubscriptionRequestState {
    subscriptionId: number;
    cancelOnly: boolean;
    transactionId: string;
    cancelReason: string;
    cancellationDetails: CancellationDetails;
    planCode: string;
    useCardOnFile: boolean;
    paymentInfo: PaymentInfo;
    loadReviewOrderDataIsProcessing: boolean;
    submitChangeSubscriptionDataIsProcessing: boolean;
    willBeCancelledLater: boolean;
    currentUTCDayHour: CurrentUTCDayHour;
    selectedGridPackageName: string;
    cancelByChatAllowed: boolean;
    preselectedPlanIsEnabled: boolean;
    planIsSelectedFromGrid: boolean;
    isRefreshAllowed?: boolean;
}
const initialState: CancelSubscriptionRequestState = {
    cancelReason: null,
    subscriptionId: null,
    transactionId: null,
    cancelOnly: false,
    cancellationDetails: null,
    planCode: null,
    useCardOnFile: false,
    paymentInfo: null,
    loadReviewOrderDataIsProcessing: false,
    submitChangeSubscriptionDataIsProcessing: false,
    willBeCancelledLater: false,
    currentUTCDayHour: { day: null, hour: null },
    selectedGridPackageName: null,
    cancelByChatAllowed: false,
    preselectedPlanIsEnabled: false,
    planIsSelectedFromGrid: false,
    isRefreshAllowed: true,
};

const stateReducer = createReducer(
    initialState,
    on(setCancelReason, (state, { cancelReason }) => ({ ...state, cancelReason: cancelReason })),
    on(setSubscriptionId, (state, { subscriptionId }) => ({ ...state, subscriptionId })),
    on(setCancelOnlyModeOn, (state) => ({ ...state, cancelOnly: true })),
    on(setTransactionId, (state, { transactionId }) => ({ ...state, transactionId })),
    on(setCancellationDetails, (state, { cancellationDetails }) => ({ ...state, cancellationDetails })),
    on(setPlanCode, (state, { planCode }) => ({ ...state, planCode })),
    on(setCurrentUTCDayHour, (state, { currentUTCDayHour }) => ({ ...state, currentUTCDayHour })),
    on(setPaymentInfo, (state, { paymentInfo }) => ({ ...state, paymentInfo })),
    on(clearPaymentInfo, (state) => ({ ...state, paymentInfo: null })),
    on(setToUseCardOnFile, (state) => ({ ...state, useCardOnFile: true })),
    on(setToNotUseCardOnFile, (state) => ({ ...state, useCardOnFile: false })),
    on(setLoadReviewOrderDataAsProcessing, (state) => ({ ...state, loadReviewOrderDataIsProcessing: true })),
    on(setLoadReviewOrderDataAsNotProcessing, (state) => ({ ...state, loadReviewOrderDataIsProcessing: false })),
    on(setWillBeCancelledLaterToTrue, (state) => ({ ...state, willBeCancelledLater: true })),
    on(setSubmitChangeSubscriptionDataAsProcessing, (state) => ({ ...state, submitChangeSubscriptionDataIsProcessing: true })),
    on(setSubmitChangeSubscriptionDataAsNotProcessing, (state) => ({ ...state, submitChangeSubscriptionDataIsProcessing: false })),
    on(setSelectedPackageNameFromOfferGrid, (state, { packageName }) => ({ ...state, selectedGridPackageName: packageName })),
    on(setCancelByChatAllowed, (state, { cancelByChatAllowed }) => ({ ...state, cancelByChatAllowed })),
    on(setPreselectedPlanIsEnabled, (state, { preselectedPlanIsEnabled }) => ({ ...state, preselectedPlanIsEnabled })),
    on(setPlanIsSelectedFromGrid, (state) => ({ ...state, planIsSelectedFromGrid: true })),
    on(resetPlanIsSelectedFromGrid, (state) => ({ ...state, planIsSelectedFromGrid: false })),
    on(setIsRefreshAllowed, (state, { isRefreshAllowed }) => ({ ...state, isRefreshAllowed: isRefreshAllowed }))
);

export function reducer(state: CancelSubscriptionRequestState, action: Action) {
    return stateReducer(state, action);
}
