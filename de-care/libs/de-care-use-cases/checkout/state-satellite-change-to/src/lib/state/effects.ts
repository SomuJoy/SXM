import { Injectable } from '@angular/core';
import { setPaymentInfo } from '@de-care/de-care-use-cases/checkout/state-common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, switchMap } from 'rxjs/operators';
import { collectPaymentInfo } from './public.actions';
import { setSelectedRadioId } from './actions';
import { LoadAccountNonPiiDirectResponseWorkflowService } from '@de-care/domains/account/state-account';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _loadAccountNonPiiDirectResponseWorkflowService: LoadAccountNonPiiDirectResponseWorkflowService) {}

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

    loadNonPiiOnSelectedRadioId$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(setSelectedRadioId),
                // Call non-pii but don't have the results go to application state
                //  (Microservices needs this call so the selected radio id ends up in session to be used for quotes/transaction calls)
                switchMap(({ radioId }) => this._loadAccountNonPiiDirectResponseWorkflowService.build({ radioId }))
            ),
        {
            dispatch: false,
        }
    );
}
