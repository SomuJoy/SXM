import { createSelector } from '@ngrx/store';
import { getPlanCodesForSubmission, getCurrentSubscription } from './state.selectors';
import { getQuote } from '@de-care/domains/quotes/state-quote';
import { getOffersDataForAllOffers } from '@de-care/domains/offers/state-offers';

export const getRequestDataForQuoteQuery = createSelector(getCurrentSubscription, getPlanCodesForSubmission, (subscription, selectedPlancodes) => ({
    subscriptionId: subscription.id,
    planCodes: selectedPlancodes.audioPlans.concat(selectedPlancodes.infotainmentPlans)
}));

export const getOrderSummaryData = createSelector(getQuote, getOffersDataForAllOffers, (quotes, offersData) => {
    return quotes ? { quotes, offersData } : null;
});
