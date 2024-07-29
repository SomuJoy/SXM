import { Action, createReducer, on } from '@ngrx/store';
import { setAccountNumber, setRadioId, setRenewalOfferPackageName } from './actions';

export const featureKey = 'planChoiceOrganic';

export interface PlanChoiceOrganicState {
    accountNumber: string;
    radioId: string;
    selectedRenewalOfferPackageName: string;
}

const initialState: PlanChoiceOrganicState = {
    accountNumber: null,
    radioId: null,
    selectedRenewalOfferPackageName: null
};

const stateReducer = createReducer(
    initialState,
    on(setAccountNumber, (state, { accountNumber }) => ({ ...state, accountNumber })),
    on(setRadioId, (state, { radioId }) => ({ ...state, radioId })),
    on(setRenewalOfferPackageName, (state, { selectedRenewalOfferPackageName }) => ({ ...state, selectedRenewalOfferPackageName }))
);

export function reducer(state: PlanChoiceOrganicState, action: Action) {
    return stateReducer(state, action);
}
