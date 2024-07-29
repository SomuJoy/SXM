import { Action, createReducer, on } from '@ngrx/store';
import { setContactPreferencesData, setModifySubscriptionOptions } from './actions';
import { ContactPreferences, ModifySubscriptionOptions } from './models';
import { clearAllModifySubscriptionOptions } from './public.actions';

export const featureKey = 'accountManagementFeature';
export interface AccountManagementState {
    subscriptions: { [subscriptionId: number]: ModifySubscriptionOptions };
    contactPreferences: ContactPreferences | null;
}
const initialState: AccountManagementState = {
    subscriptions: {},
    contactPreferences: null,
};

const stateReducer = createReducer(
    initialState,
    on(setModifySubscriptionOptions, (state, { subscriptionId, modifySubscriptionOptions }) => ({
        ...state,
        subscriptions: { ...state.subscriptions, [subscriptionId]: modifySubscriptionOptions },
    })),
    on(setContactPreferencesData, (state, { contactPreferences }) => ({
        ...state,
        contactPreferences: { ...state.contactPreferences, ...contactPreferences },
    })),
    on(clearAllModifySubscriptionOptions, (state) => ({ ...state, subscriptions: {} }))
);

export function reducer(state: AccountManagementState, action: Action) {
    return stateReducer(state, action);
}
