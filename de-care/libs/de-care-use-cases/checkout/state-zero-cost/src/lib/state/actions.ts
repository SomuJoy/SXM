import { createAction, props } from '@ngrx/store';

export const collectAllInboundQueryParams = createAction('[Zero Cost] Collect all inbound query params', props<{ inboundQueryParams: { [key: string]: string } }>());
export const initTransactionId = createAction('[Checkout Common] Create transaction id');
export const setTransactionIdForSession = createAction('[Zero Cost] Set transaction id for session', props<{ transactionIdForSession: string }>());
export const setSelectedPlanCode = createAction('[Zero Cost] Set Selected PlanCode', props<{ planCode: string }>());
export const setCustomerInfo = createAction(
    '[Zero Cost] Set Customer Info',
    props<{
        customerInfo: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            serviceAddress: {
                addressLine1: string;
                city: string;
                state: string;
                zip: string;
                country: string;
                avsValidated: boolean;
            };
        };
    }>()
);
export const clearCustomerInfo = createAction('[Zero Cost] Clear Customer Info');
export const setSelectedProvinceCode = createAction('[Zero Cost] Set Selected Province', props<{ provinceCode: string }>());
export const setDeviceInfo = createAction(
    '[Zero Cost] Set Device Info',
    props<{
        deviceInfo: {
            last4DigitsOfRadioId: string;
            channelId?: number;
            primaryBrandId?: number;
            promoCode?: string;
            deviceStatus?: string;
            vehicleInfo: {
                year: string | number;
                make: string;
                model: string;
                vin?: string;
            };
        };
    }>()
);
export const setSuccessfulTransactionData = createAction(
    '[Zero Cost] Set successful transaction data',
    props<{
        transactionData: {
            email: string;
            status: string;
            radioId: string;
            subscriptionId: number;
            accountNumber: string;
            isUserNameSameAsEmail: boolean;
            isOfferStreamingEligible: boolean;
            isEligibleForRegistration: boolean;
        };
    }>()
);
export const clearTransactionData = createAction('[Zero Cost] Clear transaction data');
