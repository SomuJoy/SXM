import { createAction, props } from '@ngrx/store';

export { setSelectedRadioId } from './actions';

export const collectPaymentInfo = createAction(
    '[Checkout Satellite Change To] Collect payment info',
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
