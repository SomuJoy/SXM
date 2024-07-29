import { createAction, props } from '@ngrx/store';

export { setSelectedRadioId } from './actions';

export const captureUserSelectedPlanCode = createAction('[Checkout Satellite] Capture user selected plan code', props<{ planCode: string }>());
export const collectPaymentInfo = createAction(
    '[Checkout Satellite] Collect payment info',
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

export const activeSubscriptionPageReadyForDisplay = createAction('[Checkout Satellite] Set active subscription page ready for display');
