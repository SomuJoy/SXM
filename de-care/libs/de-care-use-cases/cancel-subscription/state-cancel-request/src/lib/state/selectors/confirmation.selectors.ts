import { createSelector } from '@ngrx/store';
import { getAccountRadioService, accountPlanTypeIsTrial, getFirstAccountSubscriptionFirstPlan, getFirstAccountSubscriptionId } from '@de-care/domains/account/state-account';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getOffersDataForAllOffers } from '@de-care/domains/offers/state-offers';
import { getIsRefreshAllowed } from './state.selectors';

export const getConfirmationData = createSelector(
    getAccountRadioService,
    getFirstAccountSubscriptionFirstPlan,
    getOffersDataForAllOffers,
    getQuote,
    getFirstAccountSubscriptionId,
    getIsRefreshAllowed,
    (radioService, plan, offersData, quotes, subscriptionId, isRefreshAllowed) => {
        return {
            radioId: radioService?.radioId,
            last4DigitsOfRadioId: radioService?.last4DigitsOfRadioId,
            planIsTrial: accountPlanTypeIsTrial(plan?.type),
            offersData,
            quotes,
            subscriptionId,
            isRefreshAllowed,
        };
    }
);
