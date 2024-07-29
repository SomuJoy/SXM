import { createAction, props } from '@ngrx/store';

export const collectPaymentInfo = createAction(
    '[Checkout Upgrade] Collect payment info',
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
export const finishPageLoading = createAction('[Checkout Upgrade] Finish page Loading');
export const collectSelectedPlanCode = createAction('[Checkout Upgrade] Set selected plan code', props<{ planCode: string }>());

export const setCurrentLocale = createAction('[Checkout Upgrade] Set current locale', props<{ locale: string }>());
