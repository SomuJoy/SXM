import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { setCustomerInfoToSubmit } from './actions';

export interface InfoCustomerCollection {
    infoToSubmit: {
        botId: string;
        conversationId: string;
        message: string;
        userId: string;
        contextVariables: { name: string; value: string }[];
    };
}

const initialState = { infoToSubmit: null };

export const featureKey = 'infoCustomerCollectionFeature';
export const selectFeatureState = createFeatureSelector<InfoCustomerCollection>(featureKey);

const featureReducer = createReducer(
    initialState,
    on(setCustomerInfoToSubmit, (state, { infoToSubmit }) => ({ ...state, infoToSubmit }))
);

export function reducer(state: InfoCustomerCollection, action: Action) {
    return featureReducer(state, action);
}
