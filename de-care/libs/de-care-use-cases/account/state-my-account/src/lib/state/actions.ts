import { createAction, props } from '@ngrx/store';
import { locales } from './helpers';

export const setSelectedSubscriptionId = createAction('[My Account], Set selected Subscription Id', props<{ selectedSubscriptionId: string }>());
export const setCancelByChatAllowed = createAction('[My Account], Set Cancel By Chat Allowed', props<{ cancelByChatAllowed: boolean }>());
export const setSubscriptionsExpanded = createAction('[My Account], Set Subscriptions Expanded', props<{ subscriptionsExpanded: boolean }>());

export const loadNba = createAction('[My Account], Load Next Best Action');

export const setPvipOverlayShowStatus = createAction(
    '[My Account] Set pvip overlay show status',
    props<{
        pvipOverlayShowStatus: boolean;
    }>()
);
export const setPlatinumBundleOverlayShowStatus = createAction(
    '[My Account] Set platinum bundle overlay show status',
    props<{
        platinumBundleOverlayShowStatus: boolean;
    }>()
);
export const setBillingActivityFilter = createAction('[My Account], Set Billing Activity Filter', props<{ date?: string; device?: string }>());
export const setPaymentHistoryMaxItems = createAction('[My Account], Set Payment History Max Items', props<{ paymentHistoryMaxItems: number }>());
export const incrementPaymentHistoryMaxItems = createAction('[My Account], Increment Payment History Max Items', props<{ increment: number }>());
export const setBillingHistoryMaxItems = createAction('[My Account], Set Billing History Max Items', props<{ billingHistoryMaxItems: number }>());
export const incrementBillingHistoryMaxItems = createAction('[My Account], Increment Billing History Max Items', props<{ increment: number }>());
export const setSkipCancelOverlay = createAction('[My Account] Set Skip Cancel Overlay', props<{ skipCancelOverlay: boolean }>());
export const setCurrentLocale = createAction('[My Account] Set current locale', props<{ locale: locales }>());
