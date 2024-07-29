import { createSelector } from '@ngrx/store';

import { getAccountEmailAddress, getBillingAddressNormalized, getEBillData, getPaymentMethodData } from './selectors';
import { getBillingSummaryCards } from './selectors';
export { getBillingData } from './selectors';

export const getPaymentInfoSectionData = createSelector(
    getPaymentMethodData,
    getBillingAddressNormalized,
    getEBillData,
    getAccountEmailAddress,
    (paymentMethod, billingAddress, eBill, accountEmail) => ({
        paymentMethod,
        billingAddress,
        eBill,
        accountEmail,
    })
);
export const getBillingInfoSectionData = createSelector(getBillingSummaryCards, (billingSummaryCards) => ({
    billingSummaryCards,
}));
