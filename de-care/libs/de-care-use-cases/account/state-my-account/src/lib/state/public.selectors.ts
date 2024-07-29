import { createSelector } from '@ngrx/store';
import { getAccountBillingSummary, getAccountSubscriptions, getIsCanada, isPlanNextOrForwardBundle, selectAccount } from '@de-care/domains/account/state-account';
import {
    getFirstNameForAuthPanel,
    getFirstPvipSubscriptionIdIfOnlyOnePvipSub,
    getPvipOverlayShowStatus,
    getRadioIdForRefreshLink,
    selectFeature,
    getShowPriceChangeMessageOnAccount,
    selectSkipCancelOverlay,
    getPlatinumBundleOverlayShowStatus,
} from './state.selectors';
import {
    getNbaActions,
    getNbaAlerts,
    getNbaAlertsLoading,
    getNbaConvertTrialAlert,
    getNbaIdentificationState,
    NextBestAction,
} from '@de-care/domains/account/state-next-best-actions';
import { isPlatinumVip } from '@de-care/domains/offers/state-package-descriptions';
export { getAccountAccountNumber, getAccountBillingSummaryAmountDue, getAccountSubscriptions } from '@de-care/domains/account/state-account';

export const getAccountFirstName = createSelector(getFirstNameForAuthPanel, (firstName) => firstName);

export const getAuthenticatedUserAccountPresenceViewModel = createSelector(getRadioIdForRefreshLink, getFirstNameForAuthPanel, (radioId, firstName) => ({
    radioId: radioId,
    firstName: firstName,
}));

export const getHasLanguageToggle = createSelector(getIsCanada, (isCanada) => isCanada);

export const getSelectedSubscriptionId = createSelector(selectFeature, (state) => state?.selectedSubscriptionId);

export const getCancelByChatAllowed = createSelector(selectFeature, (state) => state?.cancelByChatAllowed);
export const getAlerts = createSelector(getNbaAlerts, (alerts) => alerts);
export const getAlertsToDisplay = createSelector(getNbaAlerts, (alerts) => alerts?.slice(0, 3));
export const getConvertTrialEndDate = createSelector(getNbaConvertTrialAlert, (trialAlert) => trialAlert?.endDate);
export const getIsAlertCritical = createSelector(getAlerts, (alerts) => alerts?.[0]?.type === 'PAYMENT');
export const getAlertsCount = createSelector(getAlertsToDisplay, (alerts) => alerts?.length);
export const getAlertsLoading = createSelector(getNbaAlertsLoading, (alertsLoading) => alertsLoading);
export const getIdentificationState = createSelector(getNbaIdentificationState, (identificationState) => identificationState);
export const getActions = createSelector(getNbaActions, (nbaActions) => nbaActions);
export const getAlertTypes = createSelector(getNbaAlerts, (alerts) => alerts?.map((alert: NextBestAction) => alert.type));
export const getSubscriptionsExpanded = createSelector(selectFeature, (state) => state?.subscriptionsExpanded);
export const getAccountHasOnlyOnePlatinumBundlePlan = createSelector(getAccountSubscriptions, (subscriptions) => {
    const platinumBundlePlans = subscriptions?.filter((sub) => sub.plans?.every((plan) => isPlanNextOrForwardBundle(plan?.type)));
    return platinumBundlePlans?.length === 1 ? true : false;
});
export const getPlatinumBundleNextOrForwardOverlayShowStatus = createSelector(
    getAccountHasOnlyOnePlatinumBundlePlan,
    getPlatinumBundleOverlayShowStatus,
    (nextOrForward, status) => nextOrForward && status
);

export const getPvipSubIdOnOverlayShowStatus = createSelector(
    getFirstPvipSubscriptionIdIfOnlyOnePvipSub,
    getPvipOverlayShowStatus,
    getAccountHasOnlyOnePlatinumBundlePlan,
    (pvipSubId, status, nextOrForwardBundle) => (status && !nextOrForwardBundle ? pvipSubId : null)
);

export const getSelectedSubscription = createSelector(getSelectedSubscriptionId, getAccountSubscriptions, (subId, subscriptions) =>
    subscriptions?.find((subscription) => subscription.id === subId)
);
export const getSelectedRadioId = createSelector(getSelectedSubscription, (sub) => sub?.radioService?.radioId);
export const getSelectedSubscriptionFirstPlan = createSelector(getSelectedSubscription, (sub) => sub?.plans?.[0]);
export const getNextBillingPaymentDate = createSelector(getAccountBillingSummary, (billingSummary) => billingSummary?.nextPaymentDate);
export const getDoesAccountOnlyHaveOnePvipSubscription = createSelector(getAccountSubscriptions, (subscriptions) => {
    const pvipSubs = subscriptions?.filter((sub) => sub.plans?.every((plan) => isPlatinumVip(plan?.packageName)));
    return pvipSubs?.length === 1;
});
export const getBillingActivityFilter = createSelector(selectFeature, (feature) => feature?.billingActivityFilter);
export const getPaymentHistoryMaxItems = createSelector(selectFeature, (feature) => feature?.paymentHistoryMaxItems);
export const getBillingHistoryMaxItems = createSelector(selectFeature, (feature) => feature?.billingHistoryMaxItems);

export const getAccountPresenceViewModel = createSelector(
    selectAccount,
    getNextBillingPaymentDate,
    getShowPriceChangeMessageOnAccount,
    (account, nextBillingPaymentDate, showPriceChangeMessage) => {
        if (!account) {
            return null;
        }
        return {
            customerName: account?.firstName,
            accountNumber: account?.accountNumber,
            nextBillingPaymentDate,
            showPriceChangeMessage,
        };
    }
);

export const getSkipCancelOverlay = createSelector(selectSkipCancelOverlay, (skipOverlay) => skipOverlay);
export const getCurrentLocale = createSelector(selectFeature, (state) => state.currentLocale);
