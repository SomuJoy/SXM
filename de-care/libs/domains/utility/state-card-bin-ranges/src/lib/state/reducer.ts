import { createReducer, on } from '@ngrx/store';
import { setCardBinRanges } from './actions';

export const featureKey = 'stateCardBinRanges';

export interface StateCardBinRanges {
    cardBinRanges?: {
        name: string;
        type: string;
        priority: number;
        regex: string;
    }[];
}

export const initialState: StateCardBinRanges = {};

export const reducer = createReducer(
    initialState,
    on(setCardBinRanges, (state, { cardBinRanges }) => ({
        ...state,
        cardBinRanges,
    }))
);
