import { createAction, props } from '@ngrx/store';

export const behaviorEventReactionStreamingFlepzLookupSuccess = createAction('[Behavior Event] Reaction - Streaming FLEPZ lookup successful');
export const behaviorEventReactionStreamingFlepzLookupReturnedSingleAccount = createAction(
    '[Behavior Event] Reaction - Streaming FLEPZ lookup returned single account',
    props<{ subscriptions: { eligibilityType: string; eligibleService: string; inEligibleReasonCode: string; last4DigitsOfRadioId?: string; type?: string }[] }>()
);
export const behaviorEventReactionStreamingFlepzLookupReturnedMultipleAccounts = createAction(
    '[Behavior Event] Reaction - Streaming FLEPZ lookup returned multiple accounts',
    props<{ subscriptions: { eligibilityType: string; eligibleService: string; inEligibleReasonCode: string; last4DigitsOfRadioId?: string; type?: string }[] }>()
);
export const behaviorEventReactionStreamingFlepzLookupReturnedNoAccounts = createAction('[Behavior Event] Reaction - Streaming FLEPZ lookup did not return accounts');
export const behaviorEventReactionStreamingFlepzLookupFailure = createAction('[Behavior Event] Reaction - Streaming FLEPZ lookup failed', props<{ error: any }>());
