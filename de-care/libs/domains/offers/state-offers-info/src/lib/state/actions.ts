import { createAction, props } from '@ngrx/store';
import { OfferInfoModel } from './reducer';

export const setCurrentLocale = createAction('[Offers Info] Set current locale', props<{ locale: string }>());
export const setOfferInfoForOffers = createAction('[Offers Info] Set offer info for offers', props<{ offersInfo: OfferInfoModel[] }>());
export const removeAllOfferInfoForOffers = createAction('[Offers Info] Remove all offer info for offers');
export const setOfferInfo = createAction('[Offers Info] Set offer info', props<{ offerInfo: OfferInfoModel }>());
