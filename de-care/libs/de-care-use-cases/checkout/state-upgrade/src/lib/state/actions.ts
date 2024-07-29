import { createAction, props } from '@ngrx/store';

export const setSelectedRadioId = createAction('[Checkout Upgrade] Set selected radio id', props<{ radioId: string }>());
export const setSelectedSubscriptionId = createAction('[Checkout Upgrade] Set Selected SubscriptionId', props<{ subscriptionId: number }>());
export const clearTransactionData = createAction('[Checkout Upgrade] Clear transaction data');
export const setSuccessfulTransactionData = createAction(
    '[Checkout Upgrade] Set successful transaction data',
    props<{
        transactionData: {
            email: string;
            subscriptionId: number;
            accountNumber: string;
            isUserNameSameAsEmail: boolean;
            isOfferStreamingEligible: boolean;
            isEligibleForRegistration: boolean;
        };
    }>()
);
export const fetchUpgradeSecurityQuestions = createAction('[Checkout Upgrade] Fetch Security Questions');
