import { Action, createReducer, on } from '@ngrx/store';
import { setAccountNumber, setPickAPlanSelectedOfferPackageName, setPickAPlanSelectedOfferPlanCode, setRadioId, setCanUseDetailedGrid } from './actions';

export const featureKey = 'planChoiceOrganic';

export interface PlanChoiceOrganicState {
    accountNumber: string;
    radioId: string;
    selectedOfferPackageName: string;
    selectedOfferPlanCode: string;
    canUseDetailedGrid: boolean;
}

const initialState: PlanChoiceOrganicState = {
    accountNumber: null,
    radioId: null,
    selectedOfferPackageName: null,
    selectedOfferPlanCode: null,
    canUseDetailedGrid: false,
};

const stateReducer = createReducer(
    initialState,
    on(setAccountNumber, (state, { accountNumber }) => ({ ...state, accountNumber })),
    on(setRadioId, (state, { radioId }) => ({ ...state, radioId })),
    on(setPickAPlanSelectedOfferPackageName, (state, { selectedOfferPackageName }) => ({ ...state, selectedOfferPackageName })),
    on(setPickAPlanSelectedOfferPlanCode, (state, { selectedOfferPlanCode }) => ({ ...state, selectedOfferPlanCode })),
    on(setCanUseDetailedGrid, (state, { canUseDetailedGrid }) => ({ ...state, canUseDetailedGrid }))
);

export function reducer(state: PlanChoiceOrganicState, action: Action) {
    return stateReducer(state, action);
}
