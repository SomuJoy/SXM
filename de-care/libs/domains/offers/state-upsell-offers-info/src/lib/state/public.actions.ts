import { createAction, props } from '@ngrx/store';

export const loadUpsellOfferInfoForUpsellOffers = createAction(
    '[Upsell Offers Info] Load upsell offer info for offers',
    props<{
        upsellOffersInfoRequest: {
            leadOfferPlanCode: string;
            packageUpsellPlanCode?: string;
            termUpsellPlanCode?: string;
            packageAndTermUpsellPlanCode?: string;
            province?: string;
            locales: string[];
            country: string;
        };
    }>()
);
export const clearUpsellOffersInfo = createAction('[Upsell Offers Info] Clear upsell offer info for offers');
