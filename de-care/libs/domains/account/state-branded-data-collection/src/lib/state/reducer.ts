import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { setCustomerDataCollection } from './actions';

export interface BrandedDataCollectionState {
    customerDataCollection: {
        formType: string;
        displayFields: string[];
        botId: string;
        conversationId: string;
        userId: string;
    };
}

const initialState = {
    customerDataCollection: {
        formType: null,
        displayFields: [],
        botId: null,
        conversationId: null,
        userId: null,
    },
};

export const featureKey = 'brandedDataCollectionKey';
export const selectFeatureState = createFeatureSelector<BrandedDataCollectionState>(featureKey);

const featureReducer = createReducer(
    initialState,
    on(setCustomerDataCollection, (state, { customerDataCollection }) => ({ ...state, customerDataCollection }))
);

export function reducer(state: BrandedDataCollectionState, action: Action) {
    return featureReducer(state, action);
}
