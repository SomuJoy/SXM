import { createAction, props } from '@ngrx/store';

export const setSelectedRadioId = createAction('[Checkout Satellite Change To] Set selected radio id', props<{ radioId: string }>());
export const setSelectedSubscriptionId = createAction('[Checkout Satellite Change To] Set selected subscription id', props<{ subscriptionId: string }>());
export const setSubscriptionIdToChangeFrom = createAction(
    '[Checkout Satellite Change To] Set subscription id to change from',
    props<{ subscriptionIdToChangeFrom: string }>()
);
export const setSelectedUpsellPlanCode = createAction('[Checkout Satellite Change To] Set selected upsell plancode', props<{ planCode: string }>());
export const clearTransactionData = createAction('[Checkout Satellite Change To] Clear transaction data');
export const setSuccessfulTransactionData = createAction(
    '[Checkout Satellite Change To] Set successful transaction data',
    props<{
        transactionData: {
            email: string;
            subscriptionId: number | string;
            accountNumber: string;
            isUserNameSameAsEmail: boolean;
            isOfferStreamingEligible: boolean;
            isEligibleForRegistration: boolean;
        };
    }>()
);
