import { createAction, props } from '@ngrx/store';

export const setSelectedRadioId = createAction('[Checkout Satellite] Set selected radio id', props<{ radioId: string }>());
export const setSelectedSubscriptionId = createAction('[Checkout Satellite] Set selected subscription id', props<{ subscriptionId: string }>());
export const clearTransactionData = createAction('[Checkout Satellite] Clear transaction data');
export const setSuccessfulTransactionData = createAction(
    '[Checkout Satellite] Set successful transaction data',
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

export const setDeviceInfo = createAction(
    '[Checkout Satellite] Set Device Info',
    props<{
        deviceInfo: {
            radioId?: string;
            last4DigitsOfRadioId?: string;
            channelId?: number;
            primaryBrandId?: string | number;
            promoCode?: string;
            deviceStatus?: string;
            vehicleInfo?: {
                year?: string | number;
                make?: string;
                model?: string;
                vin?: string;
            };
            nickname?: string;
            hasDuplicateVehicleInfo?: boolean;
        };
    }>()
);
