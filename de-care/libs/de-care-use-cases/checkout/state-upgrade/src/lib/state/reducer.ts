import { Action, createReducer, on } from '@ngrx/store';
import { setSelectedSubscriptionId, setSuccessfulTransactionData, clearTransactionData, setSelectedRadioId } from './actions';
import { setCurrentLocale } from './public.actions';

export const featureKey = 'upgrade';

export interface UpgradeState {
    selectedRadioId?: string;
    selectedSubscriptionId?: number;
    transactionData?: {
        email: string;
        subscriptionId: number;
        accountNumber: string;
        isUserNameSameAsEmail: boolean;
        isOfferStreamingEligible: boolean;
        isEligibleForRegistration: boolean;
    };
    currentLocale?: string;
}

const initialState: UpgradeState = {};

function normalizeLangToLocale(locale: string): string {
    return locale?.replace('-', '_');
}

const featureReducer = createReducer(
    initialState,
    on(setSelectedRadioId, (state, { radioId }) => ({ ...state, selectedRadioId: radioId })),
    on(setSelectedSubscriptionId, (state, { subscriptionId }) => ({ ...state, selectedSubscriptionId: subscriptionId })),
    on(setSuccessfulTransactionData, (state, { transactionData }) => ({ ...state, transactionData: { ...transactionData } })),
    on(clearTransactionData, (state) => ({ ...state, transactionData: undefined })),
    on(setCurrentLocale, (state, { locale }) => ({ ...state, currentLocale: normalizeLangToLocale(locale) }))
);

export function reducer(state: UpgradeState, action: Action) {
    return featureReducer(state, action);
}
