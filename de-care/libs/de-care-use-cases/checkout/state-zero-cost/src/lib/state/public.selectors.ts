import { getFirstAccountSubscriptionFirstPlan } from '@de-care/domains/account/state-account';
import { getSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { createSelector } from '@ngrx/store';
import {
    featureState,
    getCustomerInfo,
    getDeviceInfo,
    getDeviceRadioId,
    getDeviceVehicleInfo,
    getSelectedOffer,
    getSelectedOfferInfoHero,
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOfferOfferInfoOfferDescription,
} from './selectors';

export const getSelectedOfferViewModel = createSelector(
    getSelectedOfferInfoHero,
    getSelectedOfferOfferInfoOfferDescription,
    getSelectedOfferOfferInfoLegalCopy,
    (hero, offerDescription, legalCopy) => ({
        hero,
        offerDescription,
        legalCopy,
    })
);

export const getAccountInfoViewModel = createSelector(
    getSelectedOfferOfferInfoLegalCopy,
    getSelectedOffer,
    getCustomerInfo,
    getDeviceVehicleInfo,
    getDeviceRadioId,
    (legalCopy, offer, customerInfo, vehicleInfo, radioId) => ({
        deviceInfo: {
            vehicleInfo,
            radioId,
        },
        offer: {
            termLength: offer.termLength,
        },
        customerInfo,
        legalCopy,
    })
);

export const getActivateRadioViewModel = createSelector(
    featureState,
    getSecurityQuestions,
    getFirstAccountSubscriptionFirstPlan,
    ({ transactionData }, securityQuestions, plan) => {
        return {
            radioId: transactionData.radioId,
            trialEndDate: plan?.endDate,
            registrationViewModel: {
                securityQuestions,
                accountInfo: { ...transactionData },
            },
            listenNowTokenData: { subscriptionId: transactionData.subscriptionId, useCase: '' },
        };
    }
);

export const deviceTransactionStateExists = createSelector(getDeviceInfo, (deviceInfo) => !!deviceInfo);
