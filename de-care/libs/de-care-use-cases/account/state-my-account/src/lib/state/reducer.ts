import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import {
    setSelectedSubscriptionId,
    setCancelByChatAllowed,
    setSubscriptionsExpanded,
    setPvipOverlayShowStatus,
    setPlatinumBundleOverlayShowStatus,
    setBillingActivityFilter,
    setPaymentHistoryMaxItems,
    incrementPaymentHistoryMaxItems,
    setBillingHistoryMaxItems,
    incrementBillingHistoryMaxItems,
    setSkipCancelOverlay,
    setCurrentLocale,
} from './actions';
import { locales } from './helpers';

export interface MyAccountState {
    selectedSubscriptionId: string;
    selectedRadioId: string;
    cancelByChatAllowed: boolean;
    subscriptionsExpanded: boolean;
    pvipOverlayShowStatus?: boolean;
    platinumBundleOverlayShowStatus?: boolean;
    billingActivityFilter?: { date: string; device: string };
    paymentHistoryMaxItems: number;
    billingHistoryMaxItems: number;
    skipCancelOverlay: boolean;
    currentLocale: locales;
}

const initialState: MyAccountState = {
    selectedSubscriptionId: null,
    selectedRadioId: null,
    cancelByChatAllowed: false,
    subscriptionsExpanded: false,
    pvipOverlayShowStatus: true,
    platinumBundleOverlayShowStatus: true,
    billingActivityFilter: { date: null, device: null },
    paymentHistoryMaxItems: 6,
    billingHistoryMaxItems: 4,
    skipCancelOverlay: false,
    currentLocale: null,
};

export const featureKey = 'myAccountFeature';
export const selectFeatureState = createFeatureSelector<MyAccountState>(featureKey);

const featureReducer = createReducer(
    initialState,
    on(setSelectedSubscriptionId, (state, { selectedSubscriptionId }) => ({ ...state, selectedSubscriptionId })),
    on(setCancelByChatAllowed, (state, { cancelByChatAllowed }) => ({ ...state, cancelByChatAllowed })),
    on(setPvipOverlayShowStatus, (state, { pvipOverlayShowStatus }) => ({ ...state, pvipOverlayShowStatus })),
    on(setPlatinumBundleOverlayShowStatus, (state, { platinumBundleOverlayShowStatus }) => ({ ...state, platinumBundleOverlayShowStatus })),
    on(setSubscriptionsExpanded, (state, { subscriptionsExpanded }) => ({ ...state, subscriptionsExpanded })),
    on(setBillingActivityFilter, (state, { date, device }) => ({ ...state, billingActivityFilter: { date, device } })),
    on(setPaymentHistoryMaxItems, (state, { paymentHistoryMaxItems }) => ({ ...state, paymentHistoryMaxItems })),
    on(incrementPaymentHistoryMaxItems, (state, { increment }) => ({ ...state, paymentHistoryMaxItems: state.paymentHistoryMaxItems + increment })),
    on(setBillingHistoryMaxItems, (state, { billingHistoryMaxItems }) => ({ ...state, billingHistoryMaxItems })),
    on(incrementBillingHistoryMaxItems, (state, { increment }) => ({ ...state, billingHistoryMaxItems: state.billingHistoryMaxItems + increment })),
    on(setSkipCancelOverlay, (state, { skipCancelOverlay }) => ({ ...state, skipCancelOverlay })),
    on(setCurrentLocale, (state, { locale }) => ({ ...state, currentLocale: locale }))
);
export function reducer(state: MyAccountState, action: Action) {
    return featureReducer(state, action);
}
