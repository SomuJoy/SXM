import { createAction, props } from '@ngrx/store';

export { setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
export { setSelectedRadioId } from './actions';
export const collectPaymentInfo = createAction(
    '[Checkout Add Radio Router] Collect payment info',
    props<{
        useCardOnFile: boolean;
        paymentInfo?: {
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
