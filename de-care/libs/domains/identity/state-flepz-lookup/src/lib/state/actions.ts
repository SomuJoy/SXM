import { createAction, props } from '@ngrx/store';
import { SubscriptionModel } from '../data-services/models';

export const setFlepzLookupSubscriptions = createAction('[Flepz Lookup] Set subscriptions', props<{ subscriptions: SubscriptionModel[] }>());
export const clearFlepzLookupSubscriptions = createAction('[Flepz Lookup] Clear subscriptions');
