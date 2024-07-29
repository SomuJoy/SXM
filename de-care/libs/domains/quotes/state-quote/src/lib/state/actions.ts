import { createAction, props } from '@ngrx/store';
import { QuoteRequestModel } from '../data-services/quote-request.interface';
import { QuoteModel, Detail } from '../data-services/quote.interface';

export const loadQuote = createAction('[Quotes] Load quote', props<{ request: QuoteRequestModel }>());
export const loadQuoteError = createAction('[Quotes] Error loading quote', props<{ error: any }>());
export const setQuote = createAction('[Quotes] Set quote', props<{ quote: QuoteModel }>());

export const setReactivationQuoteDetail = createAction('[Quotes] Set Reactivation quote detail', props<{ reactivationQuoteDetails: Detail }>());
