import { createSelector } from '@ngrx/store';
import { getOffersMatchingPackageName, getPlanCode } from './state.selectors';
import { getSavingsPercentagesForAllOffers, getTermForAllOffers } from '@de-care/domains/offers/state-offers';

export const getBillingTermPlans = createSelector(
    getOffersMatchingPackageName,
    getSavingsPercentagesForAllOffers,
    getTermForAllOffers,
    (offers, savingsPercentages, terms) => {
        return offers.length > 0
            ? offers.map(offer => {
                  return {
                      planCode: offer.planCode,
                      price: offer.price,
                      retailPrice: offer.retailPrice,
                      termLength: offer.termLength,
                      savingsPercentage: savingsPercentages[offer.planCode],
                      term: terms[offer.planCode]
                  };
              })
            : [];
    }
);

// setting whether or not to show a choice of billing terms depending on if there is more than one offer with the same packageName available
export const displayAdditionalBillingTerms = createSelector(getOffersMatchingPackageName, offers => offers.length > 1);

export const getSelectedTermInfo = createSelector(getBillingTermPlans, getPlanCode, getTermForAllOffers, (plans, planCode, terms) => {
    const selectedPlan = plans.filter(offer => offer.planCode === planCode);
    return selectedPlan.length > 0
        ? {
              isMonthly: terms[planCode] === 'monthly',
              price: selectedPlan[0].price,
              termLength: selectedPlan[0].termLength
          }
        : null;
});
