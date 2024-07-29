import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { setBillingActivity, setHasActivityServerError } from './actions';
import { createEntityCompositeKey } from './helpers';
import { clearBillingActivity, setHasInitLoaded } from './public.actions';

export const featureKey = 'accountBillingActivity';

export type locales = 'en-US' | 'en-CA' | 'fr-CA';
export interface BillingActivityRecord {
    eventType: 'Subscription' | 'Payment';
    startDate: string;
    endDate: string;
    transactionDate: number;
    billNumber: string;
    serviceFor: string;
    description: string;
    amount: number;
    radioId: string;
    sXIRLogin: string;
    locale: locales;
}

export interface State extends EntityState<BillingActivityRecord> {
    hasInitLoaded: boolean;
    hasActivityServerError: boolean; //TODO: may want to revisit this if we need to do more robust error handling
}
export type BillingActivityRecordsState = State;
export const adapter: EntityAdapter<BillingActivityRecord> = createEntityAdapter<BillingActivityRecord>({
    selectId: (record) => createEntityCompositeKey(record.transactionDate, record.billNumber, record.serviceFor, record.description, record.locale),
});
export const initialState: BillingActivityRecordsState = adapter.getInitialState({
    hasInitLoaded: false,
    hasActivityServerError: false,
});

const featureReducer = createReducer(
    initialState,
    on(setBillingActivity, (state, { billingActivity }) => adapter.upsertMany(billingActivity, state)),
    on(clearBillingActivity, (state) => adapter.removeAll(state)),
    on(setHasInitLoaded, (state, { hasInitLoaded }) => ({ ...state, hasInitLoaded })),
    on(setHasActivityServerError, (state, { hasActivityServerError }) => ({ ...state, hasActivityServerError }))
);
export function reducer(state = initialState, action: Action) {
    return featureReducer(state, action);
}
