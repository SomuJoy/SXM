import { createAction, props } from '@ngrx/store';

export const collectAllInboundQueryParams = createAction('[Checkout Common] Collect all inbound query params', props<{ inboundQueryParams: { [key: string]: string } }>());
export const setPaymentInfoWithCardType = createAction(
    '[Checkout Common] Set payment info credit card type',
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
            cardType: string | null;
        };
    }>()
);
export const setPaymentMethodUseCardOnFile = createAction('[Checkout Common] Set payment method to use card on file');
export const clearPaymentMethodUseCardOnFile = createAction('[Checkout Common] Clear payment method use card on file');
export const setTransactionIdForSession = createAction('[Checkout Common] Set transaction id for session', props<{ transactionIdForSession: string }>());
