import { createSelector } from '@ngrx/store';
import { getFirstOfferPlanCode } from '@de-care/domains/offers/state-offers';
import { getNormalizedQueryParams } from '@de-care/shared/state-router-store';

// TODO: Replace temporarily hard-coded plan code and program codes.
const getSelectedPlanCode = createSelector(getFirstOfferPlanCode, () => 'Select - 1mo - wActv|Promo $4.99/mo Select for 12mos');
const getProgramCode = createSelector(getNormalizedQueryParams, () => 'MCP5FOR12');
export const getOffersInfoWorkflowRequest = createSelector(getSelectedPlanCode, getProgramCode, (leadOfferPlanCode, programCode) => ({
    planCodes: [{ leadOfferPlanCode }],
    programCode,
}));
