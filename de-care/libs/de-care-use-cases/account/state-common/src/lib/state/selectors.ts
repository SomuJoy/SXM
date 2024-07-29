import { createSelector } from '@ngrx/store';
import { getAccountBillingAddress, getAccountBillingSummary, getAccountEmail, getAccountSubscriptions } from '@de-care/domains/account/state-account';
import { getLanguage } from '@de-care/domains/customer/state-locale';
import { getPvtTime } from '@de-care/domains/utility/state-environment-info';
import { formatCurrency } from '@angular/common';
import { BillingCardComponent } from './interface';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { getCurrentQuote } from '@de-care/domains/quotes/state-quote';

export const getPaymentMethodData = createSelector(getAccountBillingSummary, (billingSummary) => ({
    type: billingSummary?.paymentType,
    creditCard: billingSummary?.creditCard?.type,
    lastFourDigits: billingSummary?.creditCard?.last4Digits,
    expMonth: billingSummary?.creditCard?.expiryMonth,
    expYear: billingSummary?.creditCard?.expiryYear,
}));

export const getBillingAddressNormalized = createSelector(getAccountBillingAddress, (billingAddress) => ({
    ...billingAddress,
    addressLine1: billingAddress?.streetAddress,
    zip: billingAddress?.postalCode,
}));

export const getEBillData = createSelector(getAccountBillingSummary, getIsCanadaMode, (billingSummary, isCanada) => ({
    showOption: billingSummary?.paymentType?.toLowerCase() === 'invoice' && !isCanada,
    hasEBill: billingSummary?.isEBill,
}));

export const getAccountEmailAddress = createSelector(getAccountEmail, (email) => email);

export const getEbillStatus = createSelector(getEBillData, (ebill) => ebill.hasEBill);

export const getAccountHasOnlyTrialPlans = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.every((sub) => sub.plans?.every((plan) => plan.type === 'TRIAL'))
);

export const getAccountTrialPlanNearestEndDate = createSelector(getAccountSubscriptions, (subscriptions) => {
    const endDates = [];
    for (const sub of subscriptions) {
        const trialPlan = sub?.plans.find((plan) => plan.type === 'TRIAL');
        if (trialPlan) {
            endDates.push(new Date(trialPlan.endDate).getTime());
        }
    }
    endDates.sort((a, b) => b.datetime - a.datetime);
    return endDates[0];
});

export const getAccountHasAnyTrialPlansWithFollowon = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.some((sub) => sub.plans?.every((plan) => plan.type === 'TRIAL') && sub.followonPlans?.length > 0)
);

export const getAccountTrialPlansDetails = createSelector(
    getAccountHasAnyTrialPlansWithFollowon,
    getAccountTrialPlanNearestEndDate,
    (hasAnyTrialPlansWithFollowon, trialPlanNearestEndDate) => ({ hasAnyTrialPlansWithFollowon, trialPlanNearestEndDate: trialPlanNearestEndDate })
);

export const getAccountHasAtleastOneInactiveServiceDueToNonPay = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.some((sub) => sub.hasInactiveServiceDueToNonPay)
);

export const getAccountHasOnlyInactiveServiceDueToNonPay = createSelector(
    getAccountSubscriptions,
    (subscriptions) => subscriptions?.length > 0 && subscriptions.every((sub) => sub.hasInactiveServiceDueToNonPay)
);

export const getBillingData = createSelector(
    getAccountBillingSummary,
    getAccountHasOnlyTrialPlans,
    getLanguage,
    getPvtTime,
    getCurrentQuote,
    getAccountHasOnlyInactiveServiceDueToNonPay,
    getAccountHasAtleastOneInactiveServiceDueToNonPay,
    getAccountTrialPlansDetails,
    (billingSummary, hasOnlyTrialPlans, lang, pvtTime, currentQuote, hasInactiveServiceDueToNonPay, hasAtleastOneInactiveServiceDueToNonPay, accountTrialPlansDetails) => {
        let type: BillingCardComponent;
        const today = new Date(pvtTime);
        const daysSinceLastPayment = Math.floor((today.getTime() - new Date(billingSummary?.lastPaymentDate).getTime()) / (1000 * 3600 * 24));
        const showLastPayment = Math.abs(daysSinceLastPayment) < 30;
        const daysUntilNextPayment = billingSummary?.nextPaymentDate
            ? Math.floor(Math.abs((today.getTime() - new Date(billingSummary?.nextPaymentDate).getTime()) / (1000 * 3600 * 24)))
            : null;
        const isBillPastDue = billingSummary?.isAccountInCollection;
        let amountDue;
        if (hasInactiveServiceDueToNonPay) {
            amountDue = currentQuote?.totalAmount;
        } else {
            amountDue =
                billingSummary?.amountDue > 0
                    ? billingSummary.amountDue
                    : billingSummary?.amountDue + billingSummary?.nextPaymentAmount > 0
                    ? billingSummary?.amountDue + billingSummary?.nextPaymentAmount
                    : 0;
        }

        // no way to know when the past due date was, making daysDue negative just to get card to show pastDue copy
        const daysDue = isBillPastDue ? -1 : daysUntilNextPayment;

        if (hasOnlyTrialPlans && !isBillPastDue && amountDue === 0) {
            // the billing is only considered a trial if they have only have trials, and no payments due
            if (accountTrialPlansDetails.hasAnyTrialPlansWithFollowon) {
                type = 'BILLING_WITH_TRIALER_NO_PAYMENT_DUE_WITH_FOLLOWON';
            } else {
                type = 'BILLING_WITH_TRIALER_NO_PAYMENT_DUE';
            }
        } else {
            if (isBillPastDue) {
                type = 'BILLING_WITH_MAKE_PAYMENT';
            } else {
                if (billingSummary?.isPaymentTypeInvoice) {
                    if (amountDue === 0) {
                        type = 'BILLING_WITH_NO_PAYMENT_DUE';
                    } else {
                        type = 'BILLING_WITH_MAKE_PAYMENT';
                    }
                } else {
                    if (amountDue === 0) {
                        type = 'BILLING_WITH_NO_PAYMENT_DUE_AUTOMATED';
                    } else {
                        type = 'BILLING_WITH_AUTOMATED_PAYMENT';
                    }
                }
            }
        }

        return {
            type,
            data: {
                date: billingSummary?.nextPaymentDate ? billingSummary?.nextPaymentDate : accountTrialPlansDetails.trialPlanNearestEndDate,
                amount: amountDue ? formatCurrency(amountDue, lang, '$', 'USD', '1.2-2') : null,
                lastAmount: billingSummary?.lastPaymentAmount ? formatCurrency(billingSummary?.lastPaymentAmount, lang, '$', 'USD', '1.2-2') : null,
                lastDate: billingSummary?.lastPaymentDate,
                daysSinceLastPayment,
                daysDue,
                isPastDue: isBillPastDue,
                currentBalance: billingSummary?.amountDue,
                showReactivateWarning: hasAtleastOneInactiveServiceDueToNonPay,
            },
            footer: showLastPayment,
        };
    }
);

export const getBillingSummaryCards = createSelector(getBillingData, (billingData) => {
    const cardArray = [];
    cardArray.push({ ...billingData });
    return cardArray;
});
