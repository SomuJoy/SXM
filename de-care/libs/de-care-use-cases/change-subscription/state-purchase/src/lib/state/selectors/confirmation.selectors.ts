import { createSelector } from '@ngrx/store';
import { accountPlanTypeIsTrial } from '@de-care/domains/account/state-account';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getOffersDataForAllOffers } from '@de-care/domains/offers/state-offers';
import {
    getCurrentSubscriptionRadioService,
    getCurrentSubscriptionFirstPlan,
    getMaskedUserName,
    getCurrentSubscriptionId,
    getSelectedSubscriptionIDForSAL,
    getIsRefreshAllowed,
} from './state.selectors';

export const getConfirmationData = createSelector(
    getCurrentSubscriptionRadioService,
    getCurrentSubscriptionFirstPlan,
    getOffersDataForAllOffers,
    getQuote,
    getMaskedUserName,
    getCurrentSubscriptionId,
    getSelectedSubscriptionIDForSAL,
    getIsRefreshAllowed,
    (radioService, plan, offersData, quotes, maskedUsername, subscriptionId, salSubscriptionID, isRefreshAllowed) => {
        return {
            radioId: radioService?.last4DigitsOfRadioId,
            fullRadioId: radioService?.radioId,
            subscriptionEndDate: plan.endDate,
            maskedUsername,
            planIsTrial: accountPlanTypeIsTrial(plan.type),
            offersData,
            quotes,
            subscriptionId: !!salSubscriptionID ? salSubscriptionID : subscriptionId,
            isRefreshAllowed,
        };
    }
);
