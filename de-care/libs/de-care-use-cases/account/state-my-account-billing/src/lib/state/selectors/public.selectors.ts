import { createSelector } from '@ngrx/store';
import { getHasActivityServerError, getHasInitLoaded } from '@de-care/domains/account/state-billing-activity';
import { getBillingInfoSectionData, getPaymentInfoSectionData } from '@de-care/de-care-use-cases/account/state-common';
import { getBillingRecordsModeled, getPaymentRecordsModeled } from './state.selectors';
import { getBillingActivityFilter, getBillingHistoryMaxItems, getPaymentHistoryMaxItems } from '@de-care/de-care-use-cases/account/state-my-account';
import { getAccountAccountNumber } from '@de-care/domains/account/state-account';

export const getBillingSectionVM = createSelector(
    getPaymentInfoSectionData,
    getBillingInfoSectionData,
    getAccountAccountNumber,
    (paymentInfoSectionData, billingSummary, accountNumber) => ({
        paymentMethod: paymentInfoSectionData?.paymentMethod,
        billingAddress: paymentInfoSectionData?.billingAddress,
        eBill: paymentInfoSectionData?.eBill,
        accountEmail: paymentInfoSectionData?.accountEmail,
        billingCards: billingSummary?.billingSummaryCards,
        accountNumber,
    })
);

export const getAllAvailableYears = createSelector(getBillingRecordsModeled, (billingHistory) =>
    [...new Set<number>(billingHistory.map((item) => new Date(item.datetime).getFullYear()))].sort((a, b) => b - a)
);
export const getAllAvailableDevices = createSelector(getBillingRecordsModeled, (billingHistory) =>
    [...new Set<string>(billingHistory.flatMap((item) => item.records.flatMap((record) => record.name)))].sort((a, b) => (a > b ? -1 : 1))
);

export const getBillingHistoryByFilterVM = createSelector(getBillingRecordsModeled, getBillingActivityFilter, (billingHistory, filter) => {
    return billingHistory?.filter((item) => {
        const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
        return (
            (filter.date === '6MONTHS' ? item.datetime > sixMonthsAgo.getTime() : new Date(item.datetime).getFullYear().toString() === filter.date || filter.date === 'ALL') &&
            (item.records.some((record) => record.name === filter.device) || filter.device === 'ALL')
        );
    });
});

export const getBillingHistoryForDataSource = createSelector(getBillingHistoryByFilterVM, getBillingHistoryMaxItems, (billingHistory, billingHistoryMaxItems) => {
    return billingHistory.slice(0, billingHistoryMaxItems);
});

export const getShowBillingHistoryLoadMoreButton = createSelector(getBillingHistoryByFilterVM, getBillingHistoryMaxItems, ({ length }, billingHistoryMaxItems) => {
    return length > billingHistoryMaxItems;
});

export const getPaymentHistoryByFilterVM = createSelector(getPaymentRecordsModeled, getBillingActivityFilter, (paymentHistory, filter) => {
    return paymentHistory?.filter((item) => {
        const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));
        return filter.date === '6MONTHS' ? item.datetime > sixMonthsAgo.getTime() : new Date(item.datetime).getFullYear().toString() === filter.date || filter.date === 'ALL';
    });
});

export const getPaymentHistoryForDataSource = createSelector(getPaymentHistoryByFilterVM, getPaymentHistoryMaxItems, (paymentHistory, paymentHistoryMaxItems) => {
    return paymentHistory.slice(0, paymentHistoryMaxItems);
});

export const getShowPaymentHistoryLoadMoreButton = createSelector(getPaymentHistoryByFilterVM, getPaymentHistoryMaxItems, ({ length }, paymentHistoryMaxItems) => {
    return length > paymentHistoryMaxItems;
});

// Show loading animation as long as the data has not loaded, or either of the filters are still null, AND there is no server error
export const getShowLoadingAnimation = createSelector(
    getHasInitLoaded,
    getBillingActivityFilter,
    getHasActivityServerError,
    (hasInitLoaded, { date, device }, hasServerError) => (!hasInitLoaded || date === null || device === null) && !hasServerError
);

export const getShowServerError = createSelector(getHasActivityServerError, (hasServerError) => hasServerError);
