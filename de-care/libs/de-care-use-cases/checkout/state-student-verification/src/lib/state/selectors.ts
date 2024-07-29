import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectInboundQueryParams } from '@de-care/de-care-use-cases/checkout/state-common';
import { Offer } from '@de-care/domains/offers/state-offers';
import { CheckoutStudentVerificationState, featureKey } from './reducer';

export const featureState = createFeatureSelector<CheckoutStudentVerificationState>(featureKey);

export const getProgramCodeFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.programcode);

export const getLangPrefFromQueryParams = createSelector(selectInboundQueryParams, (queryParams) => queryParams?.langpref);

export const getSheerIdVerificationWidgetUrl = createSelector(featureState, (state) => state.sheerIdIdentificationWidgetUrl);

export const studentStreamingGetOfferPayload = createSelector(getProgramCodeFromQueryParams, (programCode) => ({
    programCode,
    streaming: true,
    student: true,
    doesOfferNeedFollowOn: (offer: Offer) => offer.student && offer.type === 'RTP_OFFER',
}));
