import { createAction, props } from '@ngrx/store';
import { UpsellOfferInfoModel } from './reducer';

export const setCurrentLocale = createAction('[Upsell Offers Info] Set current locale', props<{ locale: string }>());
export const setUpsellOfferInfoForUpsellOffers = createAction(
    '[Upsell Offers Info] Set upsell offer info for upsell offers',
    props<{ upsellOffersInfo: UpsellOfferInfoModel[] }>()
);
