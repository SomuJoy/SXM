import { Injectable } from '@angular/core';
import { clearCheckoutCommonTransactionState, setCustomerInfo, setPaymentInfo } from '@de-care/de-care-use-cases/checkout/state-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, map } from 'rxjs/operators';
import { clearCheckoutStreamingTransactionState, collectPaymentInfo } from './actions';

@Injectable()
export class Effects {
    constructor(private readonly _actions$: Actions) {}

    collectPaymentInfo$ = createEffect(() =>
        this._actions$.pipe(
            ofType(collectPaymentInfo),
            flatMap(({ paymentInfo }) => [
                setCustomerInfo({ customerInfo: { firstName: paymentInfo.firstName, lastName: paymentInfo.lastName, phoneNumber: paymentInfo.phoneNumber } }),
                setPaymentInfo({
                    paymentInfo: {
                        serviceAddress: {
                            addressLine1: paymentInfo.addressLine1,
                            city: paymentInfo.city,
                            state: paymentInfo.state,
                            zip: paymentInfo.zip,
                            country: paymentInfo.country,
                            avsValidated: paymentInfo.avsValidated,
                        },
                        nameOnCard: paymentInfo.nameOnCard,
                        cardNumber: paymentInfo.cardNumber,
                        cardExpirationDate: paymentInfo.expirationDate,
                        cvv: paymentInfo.cvv,
                        giftCard: paymentInfo.giftCard,
                    },
                    useCardOnFile: false,
                }),
            ])
        )
    );

    clearCheckoutStreamingTransactionState$ = createEffect(() =>
        this._actions$.pipe(
            ofType(clearCheckoutStreamingTransactionState),
            map(() => clearCheckoutCommonTransactionState())
        )
    );
}
