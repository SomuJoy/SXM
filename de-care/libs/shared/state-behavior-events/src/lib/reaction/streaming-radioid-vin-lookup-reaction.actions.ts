import { createAction, props } from '@ngrx/store';

export const behaviorEventReactionStreamingRadioIdVinLookupReturned = createAction(
    '[Behavior Event] Reaction - Streaming Radio ID/VIN lookup returned',
    props<{ subscriptions: { last4DigitsOfRadioId?: string; type?: string; }[] }>()
);