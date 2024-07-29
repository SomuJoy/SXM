import { createAction, props } from '@ngrx/store';

export const behaviorEventReactionCardBinRangesLoaded = createAction(
    '[Behavior Event] Reaction - Card bin ranges loaded',
    props<{
        binRangeNames: string[];
    }>()
);
