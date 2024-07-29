import { Action, createReducer, on } from '@ngrx/store';
import { updatePurchaseFormSteps } from '@de-care/purchase-state'; // TODO: Remove reliance on external action
import { setNucaptchaNonRequired, setNucaptchaRequired } from './checkout-triage.actions';

export const featureKey = 'checkoutTriage';

export interface CheckoutTriageState {
    steps: string[];
    nucaptchaRequired: boolean;
}

const initialState: CheckoutTriageState = {
    steps: [],
    nucaptchaRequired: false
};

const reducer = createReducer(
    initialState,
    on(updatePurchaseFormSteps, (state, action) => {
        return {
            ...state,
            steps: [...action.steps]
        };
    }),
    on(setNucaptchaRequired, state => ({
        ...state,
        nucaptchaRequired: true
    })),
    on(setNucaptchaNonRequired, state => ({
        ...state,
        nucaptchaRequired: false
    }))
);

export function checkoutTriageReducer(state: CheckoutTriageState, action: Action) {
    return reducer(state, action);
}
