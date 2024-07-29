import { createAction, props } from '@ngrx/store';

export const setSelectedRadioId = createAction('[Checkout Add Radio Router] Set selected radio id', props<{ radioId: string }>());
export const clearTransactionData = createAction('[Checkout Add Radio Router] Clear transaction data');
export const setSuccessfulTransactionData = createAction(
    '[Checkout Add Radio Router] Set successful transaction data',
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
    '[Checkout Add Radio Router] Set Device Info',
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
