import { createAction, props } from '@ngrx/store';

export const initTransactionId = createAction('[Checkout Common] Create transaction id');
export const newTransactionIdDueToCreditCardError = createAction('[Checkout Common] Create new transaction id due to credit card failure');
export const setSelectedPlanCode = createAction('[Checkout Common] Set Selected PlanCode', props<{ planCode: string }>());
export const resetSelectedPlanCodeToLeadOffer = createAction('[Checkout Common] Reset selected plan code to lead offer');
export const setCustomerInfo = createAction(
    '[Checkout Common] Set Customer Info',
    props<{
        customerInfo: { firstName: string; lastName: string; phoneNumber: string };
    }>()
);
export const clearCustomerInfo = createAction('[Checkout Common] Clear Customer Info');
export const setPaymentInfo = createAction(
    '[Checkout Common] Set Payment Info',
    props<{
        paymentInfo: {
            serviceAddress?: {
                addressLine1: string;
                city: string;
                state: string;
                zip: string;
                country: string;
                avsValidated: boolean;
            };
            billingAddress?: {
                addressLine1: string;
                city: string;
                state: string;
                zip: string;
                country: string;
                avsValidated: boolean;
            };
            nameOnCard: string;
            cardNumber: string | number;
            cardExpirationDate: string;
            cvv: string;
            giftCard: string;
        };
        useCardOnFile: boolean;
    }>()
);
export const clearPaymentInfo = createAction('[Checkout Common] Clear Payment Info');
export const setNuCaptchaRequired = createAction('[Checkout Common] Set NuCaptcha Required');
export const clearNuCaptchaRequired = createAction('[Checkout Common] Clear NuCaptcha Required');
export const hidePageLoader = createAction('[Checkout Common] Hide page loader');
export const setSelectedProvinceCode = createAction('[Checkout Common] Set Selected Province', props<{ provinceCode: string }>());
export const loadUpsellsForCheckoutIfNeeded = createAction('[Checkout Common] Load Upsells if Needed', props<{ forStreaming: boolean }>());
export const loadUpsellsForSatelitteTargetedCheckoutIfNeeded = createAction('[Checkout Common] Load Upsells for Satellite Targeted if Needed', props<{ radioId: string }>());
export const clearCheckoutCommonTransactionState = createAction('[Checkout Common] Clear Checkout common transaction state');
export const clearPaymentInfoCvv = createAction('[Checkout Common] Clear payment info cvv');
interface UserEnteredEmailPassword {
    email: string;
    password: string;
}
interface UserEnteredUsernamePassword {
    password: string;
    userName: string;
}
export const setUserEnteredCredentials = createAction('[Checkout Common] Set user entered credentials', props<UserEnteredEmailPassword | UserEnteredUsernamePassword>());
export const clearUserEnteredPassword = createAction('[Checkout Common] Clear user entered password');
export const clearUserEnteredUsername = createAction('[Checkout Common] Clear user entered username');
export const setAllowLicensePlateLookup = createAction('[Checkout Common] Set allow license plate lookup', props<{ allowLicensePlateLookup: boolean }>());
export const setIsRefreshAllowed = createAction('[Checkout Common] Set allow refresh flag', props<{ isRefreshAllowed: boolean }>());
