import { Action, createReducer, on } from '@ngrx/store';
import { setEntitlementResults, setEntitlementError, setLoginInfo, clearLoginInfo, setEntitlementId, setSelectedPartner } from './actions';
import { ThirdPatyBillingEntitlementData } from '@de-care/domains/identity/state-third-party-billing-entitlement';

export const featureKey = 'third-party-billing-provision-account';

export interface ThirPartyBillingProvisionAccountState {
    entitlementId: string;
    entitlementResults: ThirdPatyBillingEntitlementData;
    entitlementError: Error;
    loginInfo: {
        email: string;
        password: string;
    };
    partnerName: string;
}

export const initialState: ThirPartyBillingProvisionAccountState = {
    entitlementId: null,
    entitlementResults: null,
    entitlementError: null,
    loginInfo: null,
    partnerName: null
};

const stateReducer = createReducer(
    initialState,
    on(setEntitlementId, (state, { entitlementId }) => ({ ...state, entitlementId })),
    on(setEntitlementResults, (state, { entitlementResults }) => ({ ...state, entitlementResults })),
    on(setEntitlementError, (state, { error }) => ({ ...state, entitlementError: error })),
    on(setLoginInfo, (state, { loginInfo }) => ({ ...state, loginInfo })),
    on(clearLoginInfo, state => ({ ...state, loginInfo: null })),
    on(setSelectedPartner, (state, { partnerName }) => ({ ...state, partnerName }))
);

export function reducer(state: ThirPartyBillingProvisionAccountState, action: Action) {
    return stateReducer(state, action);
}
