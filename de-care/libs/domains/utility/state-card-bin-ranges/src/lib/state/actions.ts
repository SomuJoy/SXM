import { createAction, props } from '@ngrx/store';

export const setCardBinRanges = createAction(
    '[Card Bin Ranges] Set card bin ranges',
    props<{
        cardBinRanges: {
            name: string;
            type: string;
            priority: number;
            regex: string;
        }[];
    }>()
);
export const loadCardBinRangesError = createAction('[Card Bin Ranges] Error loading card bin ranges', props<{ error: unknown }>());
