import { createSelector } from '@ngrx/store';
import { getSalesHeroCopyVM, getLegalCopyData } from '@de-care/de-care-use-cases/student-verification/state-common';
import { getOfferDescriptionVM } from './state.selectors';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { selectOfferInfosForCurrentLocaleMappedByPlanCode } from '@de-care/domains/offers/state-offers-info';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';

export const trialActivationLegacyVM = createSelector(getSalesHeroCopyVM, getOfferDescriptionVM, getLegalCopyData, (salesHeroData, offerDescriptionData, legalCopyData) => ({
    salesHeroData,
    offerDescriptionData,
    legalCopyData,
}));

export const isTrialFlowInCanada = createSelector(getIsCanadaMode, (isCanadaMode) => isCanadaMode);

export const getOfferInfoDetails = createSelector(getFirstOfferPlanCode, selectOfferInfosForCurrentLocaleMappedByPlanCode, (planCode, offersInfo) => {
    return offersInfo[planCode];
});

export const getOfferDetails = createSelector(getOfferInfoDetails, (offerInfo) => offerInfo?.offerDetails);

export const getIncludeActivationInstructions = createSelector(getIsCanadaMode, (isCanada) => !isCanada);
