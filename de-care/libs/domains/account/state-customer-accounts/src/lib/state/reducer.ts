import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CustomerAccountListAccount } from '../data-services/customer-accounts-list.interface';
import { setAllCustomerAccounts } from './actions';

export const featureKey = 'customerAccounts';

export interface CustomerAccountsState extends EntityState<CustomerAccountListAccount> {}

const selectId = (item: CustomerAccountListAccount) => item.last4DigitsOfAccountNumber;

const adapter: EntityAdapter<CustomerAccountListAccount> = createEntityAdapter<CustomerAccountListAccount>({
    selectId
});

const initialState: CustomerAccountsState = adapter.getInitialState();

const stateReducer = createReducer(
    initialState,

    on(setAllCustomerAccounts, (state, { customerAccounts }) => adapter.setAll(customerAccounts, state))
);

export function reducer(state: CustomerAccountsState, action: Action) {
    return stateReducer(state, action);
}

export const { selectAll, selectEntities, selectTotal, selectIds } = adapter.getSelectors();
