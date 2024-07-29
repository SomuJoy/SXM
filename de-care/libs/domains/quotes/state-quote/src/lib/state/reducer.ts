import { Detail } from './../data-services/quote.interface';
import { Action, createReducer, on } from '@ngrx/store';
import { QuoteModel } from '../data-services/quote.interface';
import { setQuote, setReactivationQuoteDetail } from './actions';

export const featureKey = 'quoteFeature';
export interface QuoteState {
    quote: QuoteModel | null;
    reactivationQuoteDetails?: Detail | null;
}
const initialState: QuoteState = {
    quote: null,
};

const stateReducer = createReducer(
    initialState,
    on(setQuote, (state, { quote }) => ({ ...state, quote })),
    on(setReactivationQuoteDetail, (state, { reactivationQuoteDetails }) => ({ ...state, reactivationQuoteDetails }))
);

export function reducer(state: QuoteState, action: Action) {
    return stateReducer(state, action);
}
