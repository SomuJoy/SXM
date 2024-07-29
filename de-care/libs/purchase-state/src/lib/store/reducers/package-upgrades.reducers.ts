import { Action, createReducer, on } from '@ngrx/store';
import * as PurchaseActions from '../actions/purchase.actions';
import { initialPackageUpgradesState, PackageUpgrades } from '../states/package-upgrades.state';

const reducer = createReducer(
    initialPackageUpgradesState,
    on(PurchaseActions.resetPurchaseStatePackageUpgradesToInitial, () => ({ ...initialPackageUpgradesState })),
    on(PurchaseActions.GetUpsells, (state, action) => {
        return {
            ...state,
            loading: true,
            plan: action.payload.planCode
        };
    }),
    on(PurchaseActions.ReceiveUpsells, (state, action) => {
        return {
            ...state,
            loading: false,
            upgrade: action.payload
        };
    })
);

export function upsellReducer(state: PackageUpgrades, action: Action) {
    return reducer(state, action);
}
