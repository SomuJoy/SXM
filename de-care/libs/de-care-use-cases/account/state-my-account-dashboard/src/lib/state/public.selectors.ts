import { createSelector } from '@ngrx/store';
import {
    getSections,
    getBillingHeaderSpan,
    getBillingCards,
    getSubscriptionHeaderSpan,
    getSubscriptionCards,
    getFaqCardType,
    getBillingData,
    selectHideTrending,
} from './state.selectors';

export const getNextBillingPaymentDate = createSelector(getBillingData, (billingData) => billingData?.data?.date);

export const getDashboardVM = createSelector(
    getSections,
    getBillingHeaderSpan,
    getBillingCards,
    getSubscriptionHeaderSpan,
    getSubscriptionCards,
    getFaqCardType,
    selectHideTrending,
    (sections, billingHeaderSpan, billingCards, subscriptionHeaderSpan, subscriptionCards, faqCardType, hideTrending) => ({
        sections,
        billingHeaderSpan,
        billingCards,
        subscriptionHeaderSpan,
        subscriptionCards,
        faqCardType,
        hideTrending,
    })
);
