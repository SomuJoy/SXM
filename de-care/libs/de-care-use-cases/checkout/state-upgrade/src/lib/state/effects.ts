import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { fetchSecurityQuestions } from '@de-care/domains/account/state-security-questions';
import { setPaymentInfo, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { collectPaymentInfo, collectSelectedPlanCode, finishPageLoading } from './public.actions';
import { fetchUpgradeSecurityQuestions } from './actions';

@Injectable()
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store) {}

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

    pageLoadFinished$ = createEffect(() =>
        this._actions$.pipe(
            ofType(finishPageLoading),
            map(() => {
                return pageDataFinishedLoading();
            })
        )
    );

    fetchSecurityUpgradeQuestions$ = createEffect(() =>
        this._actions$.pipe(
            ofType(fetchUpgradeSecurityQuestions),
            map(() => {
                return fetchSecurityQuestions({ accountRegistered: false });
            })
        )
    );

    collectSelectedPlanCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(collectSelectedPlanCode),
            map((planCode) => setSelectedPlanCode(planCode))
        )
    );
}
