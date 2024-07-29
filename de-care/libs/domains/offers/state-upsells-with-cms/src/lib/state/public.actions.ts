import { createAction, props } from '@ngrx/store';

export const loadUpsellOffersWithCms = createAction(
    '[Upsells With CMS] Load upsells with cms',
    props<{
        upsellsRequest: {
            planCode: string;
            radioId?: string;
            streaming?: boolean;
            subscriptionId?: string;
            upsellCode?: string;
            province?: string;
            retrieveFallbackOffer?: boolean;
            locales: string[];
            country: string;
        };
    }>()
);
export const clearUpsellOffersWithCms = createAction('[Upsells With CMS] Clear upsells with cms');
