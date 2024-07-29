import { Injectable } from '@angular/core';
import { setPaymentInfo } from '@de-care/de-care-use-cases/checkout/state-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap } from 'rxjs/operators';
import { collectPaymentInfo } from './public.actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions) {}

    collectPaymentInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(collectPaymentInfo),
            flatMap(({ useCardOnFile, paymentInfo }) => [
                setPaymentInfo({
                    paymentInfo: {
                        serviceAddress: {
                            addressLine1: paymentInfo?.addressLine1,
                            city: paymentInfo?.city,
                            state: paymentInfo?.state,
                            zip: paymentInfo?.zip,
                            country: paymentInfo?.country,
                            avsValidated: paymentInfo?.avsValidated,
                        },
                        nameOnCard: paymentInfo?.nameOnCard,
                        cardNumber: paymentInfo?.cardNumber,
                        cardExpirationDate: paymentInfo?.expirationDate,
                        cvv: paymentInfo?.cvv,
                        giftCard: paymentInfo?.giftCard,
                    },
                    useCardOnFile,
                }),
            ])
        )
    );
}
