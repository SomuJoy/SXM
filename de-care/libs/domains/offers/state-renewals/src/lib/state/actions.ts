import { createAction, props } from '@ngrx/store';
import { Offer } from '../data-services/offer-renewal.interface';

export const loadOfferRenewalError = createAction('[Offer Renewal] Error loading offers', props<{ error: any }>());
export const setOfferRenewal = createAction('[Offer Renewal] Set offers', props<{ offers: Offer[] }>());
