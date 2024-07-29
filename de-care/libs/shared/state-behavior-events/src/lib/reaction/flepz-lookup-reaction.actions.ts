import { createAction } from '@ngrx/store';

export const behaviorEventReactionCustomerFlepzLookupSuccess = createAction('[Behavior Event] Reaction - Customer FLEPZ lookup successful');
export const behaviorEventReactionCustomerFlepzLookupReturnedSubscriptions = createAction('[Behavior Event] Reaction - Customer FLEPZ lookup returned subscriptions');
export const behaviorEventReactionCustomerFlepzLookupReturnedNoSubscriptions = createAction('[Behavior Event] Reaction - Customer FLEPZ lookup did not return subscriptions');
export const behaviorEventReactionCustomerFlepzLookupFailure = createAction('[Behavior Event] Reaction - Customer FLEPZ lookup failed');
