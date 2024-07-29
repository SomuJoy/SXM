import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { activeSubscriptionPageReadyForDisplay, captureUserSelectedPlanCode, collectPaymentInfo } from './public.actions';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';
import { setPaymentInfo, setSelectedPlanCode } from '@de-care/de-care-use-cases/checkout/state-common';
import { Store } from '@ngrx/store';
import { pageDataFinishedLoading } from '@de-care/de-care/shared/state-loading';
import { behaviorEventReactionPickAPlanSelected } from '@de-care/shared/state-behavior-events';
import { getAllOffersAsArray } from '@de-care/domains/offers/state-offers';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store) {}

    captureSelectedPlanCode$ = createEffect(() =>
        this._actions$.pipe(
            ofType(captureUserSelectedPlanCode),
            withLatestFrom(this._store.select(getAllOffersAsArray)),
            flatMap(([{ planCode }, offers]) => {
                const selectedOffer = offers.find((offer) => offer.planCode === planCode);
                return [setSelectedPlanCode({ planCode }), behaviorEventReactionPickAPlanSelected({ selected: { planCode, price: selectedOffer?.price } })];
            })
        )
    );

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

    activeSubscriptionPageReadyForDisplay$ = createEffect(() =>
        this._actions$.pipe(
            ofType(activeSubscriptionPageReadyForDisplay),
            map(() => pageDataFinishedLoading())
        )
    );
}
