import { createAction, props } from '@ngrx/store';
import { UpsellPackageModel } from '../data-services/upsell-offer.interfaces';

export const loadUpsellOffersError = createAction('[Upsell Offers] Error loading upsell offers', props<{ error: unknown }>());
export const setUpsellOffers = createAction('[Upsell Offers] Set upsell offers', props<{ upsellOffers: UpsellPackageModel[] }>());
