import {
    getAccountHasAtLeastOneActiveTrialPlanInFirstSubscription,
    getAccountSubscriptions,
    getClosedDevicesFromAccount,
    getFirstAccountSubscriptionId,
    getIsQuebec,
} from '@de-care/domains/account/state-account';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, UpgradeState } from './reducer';
import { getPaymentInfo, getSelectedPlanCode, getTransactionIdForSession, getUseCardOnFile, selectInboundQueryParams } from '@de-care/de-care-use-cases/checkout/state-common';
import { getRenewalQuoteDetailAsArray } from '@de-care/domains/quotes/state-quote';

export const featureState = createFeatureSelector<UpgradeState>(featureKey);
export const getSelectedRadioId = createSelector(featureState, (state) => state?.selectedRadioId);
export const getSelectedSubscriptionId = createSelector(featureState, (state) => state.selectedSubscriptionId);
export const getTransactionData = createSelector(featureState, (state) => state.transactionData);
export const getTokenFromQueryParams = createSelector(selectInboundQueryParams, ({ tkn }) => tkn);
export const getProgramCodeFromQueryParams = createSelector(selectInboundQueryParams, ({ programcode }) => programcode);
export const getAllowedQueryParamsExist = createSelector(getProgramCodeFromQueryParams, getTokenFromQueryParams, (token, programcode) => !!token && !!programcode);
export const getAccountSubscriptionForRadioId = createSelector(getSelectedRadioId, getAccountSubscriptions, (radioId, subscriptions) =>
    subscriptions?.find((subscription) => subscription?.radioService?.last4DigitsOfRadioId === radioId?.substr(-4, 4))
);
// Requests for data loads
export const getAccountRequestData = createSelector(getTokenFromQueryParams, (token) => ({ token }));
export const getOfferRequestData = createSelector(getProgramCodeFromQueryParams, getSelectedRadioId, getIsQuebec, (programCode, radioId, isQuebec) => ({
    programCode,
    radioId,
    province: isQuebec ? 'QC' : undefined, // TODO: add logic to get province from account
}));
export const getCurrentLocale = createSelector(featureState, (state) => state?.currentLocale);

export const getReviewDataForWorkflow = createSelector(
    getFirstAccountSubscriptionId,
    getSelectedPlanCode,
    getSelectedRadioId,
    getAccountHasAtLeastOneActiveTrialPlanInFirstSubscription,
    (subscriptionId, planCode, radioId, radioIsInTrial) => ({
        ...(!radioIsInTrial && subscriptionId && { subscriptionId }),
        radioId,
        planCodes: [planCode],
    })
);
export const getPayloadForPurchaseTransaction = createSelector(
    getSelectedPlanCode,
    getPaymentInfo,
    getUseCardOnFile,
    getTransactionIdForSession,
    getSelectedRadioId,
    getSelectedSubscriptionId,
    getRenewalQuoteDetailAsArray,
    (planCode, paymentInfo, useCardOnFile, transactionIdForSession, radioId, subscriptionId, renewalQuotes) => {
        return {
            radioId,
            subscriptionId,
            plans: [{ planCode }],
            followOnPlans: renewalQuotes.map(({ planCode }) => ({ planCode })), // TODO: this should eventually get changed to a better solution so we are not using "quote" data for follow on plans
            paymentInfo: {
                paymentType: 'creditCard',
                ...(useCardOnFile
                    ? { useCardOnfile: useCardOnFile }
                    : {
                          cardInfo: {
                              nameOnCard: paymentInfo?.nameOnCard,
                              cardNumber: +paymentInfo?.cardNumber,
                              expiryMonth: +paymentInfo?.cardExpirationDate?.split('/')?.[0],
                              expiryYear: +paymentInfo?.cardExpirationDate?.split('/')?.[1],
                              securityCode: paymentInfo?.cvv,
                          },
                      }),
                transactionId: transactionIdForSession,
                giftCards: paymentInfo?.giftCard ? [paymentInfo.giftCard] : [],
                paymentAmount: null,
            },
            ...(paymentInfo?.serviceAddress?.zip
                ? {
                      serviceAddress: {
                          streetAddress: paymentInfo?.serviceAddress?.addressLine1,
                          city: paymentInfo?.serviceAddress?.city,
                          state: paymentInfo?.serviceAddress?.state,
                          postalCode: paymentInfo?.serviceAddress?.zip,
                          country: paymentInfo?.serviceAddress?.country,
                          avsvalidated: paymentInfo?.serviceAddress?.avsValidated,
                          addressType: 'person',
                      },
                      billingAddress: {
                          streetAddress: paymentInfo?.serviceAddress?.addressLine1,
                          city: paymentInfo?.serviceAddress?.city,
                          state: paymentInfo?.serviceAddress?.state,
                          postalCode: paymentInfo?.serviceAddress?.zip,
                          country: paymentInfo?.serviceAddress?.country,
                          avsvalidated: paymentInfo?.serviceAddress?.avsValidated,
                          addressType: 'person',
                      },
                  }
                : {}),
        };
    }
);

export const getSelectedRadioIsClosed = createSelector(getSelectedRadioId, getClosedDevicesFromAccount, (radioId, closedDevices) =>
    closedDevices?.find((device) => device.last4DigitsOfRadioId === radioId.substr(-4, 4))
);
