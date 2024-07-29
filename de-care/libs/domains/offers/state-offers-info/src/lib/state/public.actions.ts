import { createAction, props } from '@ngrx/store';
import { OfferInfoModel } from './reducer';
import { PlanCodeInfo } from '../data-services/data-offers-info.service';

export const loadOfferInfoForOffers = createAction(
    '[Offers Info] Load offer info for offers',
    props<{ offersInfoRequest: { planCodes: PlanCodeInfo[]; province?: string; radioId?: string; locales?: string[] } }>()
);
export const loadOffersInfo400Error = createAction('[Offers Info] Load offer info 400 error', props<{ error: any }>());

/**
 * @deprecated Temporary action until we are 100% on CMS
 */
export const setLegacyOfferInfoForOffers = createAction('[Offers Info] Set legacy offer info for offers', props<{ offersInfo: OfferInfoModel[] }>());

/**
 * @deprecated Temporary action until we move recapDescription to CMS
 */
export const setRecapDescriptionForOffers = createAction(
    '[Offers Info] Set package description recapDescription property for offers',
    props<{ offersInfo: { locale: string; planCode: string; recapDescription: string; recapLongDescription?: string }[] }>()
);

export const resetOffersInfoStateToInitial = createAction('[Offers Info] Reset Offers Info State to Initial');
