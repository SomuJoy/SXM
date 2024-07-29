import { createAction, props } from '@ngrx/store';

export const setSuccessfulTransactionData = createAction(
    '[Checkout Streaming Roll to Drop] Set successful transaction data',
    props<{
        transactionData: {
            subscriptionId: number | string;
            accountNumber: string;
            isUserNameSameAsEmail: boolean;
            isOfferStreamingEligible: boolean;
            isEligibleForRegistration: boolean;
        };
    }>()
);
export const clearTransactionData = createAction('[Checkout Streaming Roll to Drop] Clear transaction data');
export const clearCheckoutStreamingTransactionState = createAction('[Checkout Streaming Roll to Drop] Clear checkout streaming roll to drop transaction state');
export const setfailedEligibilityCheckToTrue = createAction('[Checkout Streaming Roll to Drop] Set failed Eligibility check to true');
export const setfailedEligibilityCheckToFalse = createAction('[Checkout Streaming Roll to Drop] Set failed Eligibility check to false');
export const collectPaymentInfo = createAction(
    '[Checkout Streaming Roll to Drop] Collect payment info',
    props<{
        paymentInfo: {
            firstName: string;
            lastName: string;
            phoneNumber: string;
            addressLine1: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            nameOnCard: string;
            cardNumber: string;
            expirationDate: string;
            cvv: string;
            giftCard: string;
            avsValidated: boolean;
        };
    }>()
);

export const usefullAddressForm = createAction('[Checkout Streaming Roll to Drop] Full address form');
export const loadCountryCode = createAction(
    '[Checkout Streaming Roll to Drop] Load Country Code ',
    props<{
        countryCode: string;
    }>()
);
