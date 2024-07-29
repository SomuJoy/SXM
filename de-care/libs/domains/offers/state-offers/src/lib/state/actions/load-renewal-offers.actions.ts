import { createAction, props } from '@ngrx/store';
import { Offer } from '../../data-services/offer.interface';

export const loadRenewalOffersFromPlanCode = createAction('[Offers] Load renewal offers from plan code', props<{ planCode: string; renewalCode?: string }>());

export const loadRenewalOffersError = createAction('[Offers] Error loading renewal offers', props<{ error: any }>());
export const setRenewalOffers = createAction('[Offers] Set renewal offers', props<{ renewalOffers: Offer[] }>());
export const setSelectedRenewalPackageName = createAction('[Offers] Set Selected renewal package name', props<{ selectedRenewalPackageName: string }>());
