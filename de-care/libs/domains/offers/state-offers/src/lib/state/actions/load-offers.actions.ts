import { createAction, props } from '@ngrx/store';
import { Offer } from '../../data-services/offer.interface';

export const loadCustomerChangeSubscriptionOffers = createAction(
    '[Offers] Load change subscription offers for customer',
    props<{ subscriptionId: number; province?: string }>()
);
export const loadOffersError = createAction('[Offers] Error loading offers', props<{ error: any }>());
export const setOffers = createAction('[Offers] Set offers', props<{ offers: Offer[] }>());
export const loadRtdTrialOffersFromProgramCode = createAction('[Offers] Load roll to drop offers for program code', props<{ programCode: string }>());
export const resetOffersStateToInitial = createAction('[Offers] Reset Offers State to Initial');
