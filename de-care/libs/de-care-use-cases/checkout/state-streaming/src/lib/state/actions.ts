import { createAction, props } from '@ngrx/store';

export const setUserPickedAPlanCode = createAction('[Checkout Streaming] User Picked a Plan Code');

export const setSuccessfulTransactionData = createAction(
    '[Checkout Streaming] Set successful transaction data',
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
export const clearTransactionData = createAction('[Checkout Streaming] Clear transaction data');
export const collectPaymentInfo = createAction(
    '[Checkout Streaming] Collect payment info',
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

export const collectPaymentInfoBillingAddress = createAction(
    '[Checkout Streaming] Collect payment info billing address',
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

export const setProspectTokenData = createAction(
    '[Checkout Streaming] Set prospect token username',
    props<{
        prospectTokenData: {
            userName: string;
            firstName?: string;
            lastName?: string;
            streetAddress?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            phone?: string;
        };
    }>()
);

export const setPromoCode = createAction('[Checkout Streaming] Set promo code', props<{ promoCode: string }>());
export const setfailedEligibilityCheckToTrue = createAction('[Checkout Streaming] Set failed Eligibility check to true');
export const setfailedEligibilityCheckToFalse = createAction('[Checkout Streaming] Set failed Eligibility check to false');
export const clearCheckoutStreamingTransactionState = createAction('[Checkout Streaming] Clear checkout streaming transaction state');
export const setCanDisplayEarlyTerminationFeeCopies = createAction('[Checkout Streaming] Set Can display Early Termination fee copies', props<{ allowed: boolean }>());
export const setPaymentFormType = createAction('[Checkout Streaming] Set Payment form type', props<{ paymentFormType: string }>());
