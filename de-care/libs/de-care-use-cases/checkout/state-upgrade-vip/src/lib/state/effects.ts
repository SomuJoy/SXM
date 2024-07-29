import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { setPaymentMethodToNewCard, setPaymentMethodToUseCardOnFile, setSecondDevice } from './actions';
import {
    captureUserEnteredNewCard,
    captureUserSelectedSecondDevice,
    captureUserSelectedUseCardOnFile,
    lookupStepRequested,
    organicFirstStepFromRequested,
} from './public.actions';
import { behaviorEventReactionForPaymentMethod } from '@de-care/shared/state-behavior-events';
import { getIsCanadaMode } from '@de-care/shared/state-settings';
import { Store } from '@ngrx/store';
import { setProvinceSelectionDisabled } from '@de-care/domains/customer/state-locale';

@Injectable()
export class Effects {
    constructor(private readonly _actions$: Actions, private readonly _store: Store) {}

    captureUserSelectedSecondDevice$ = createEffect(() =>
        this._actions$.pipe(
            ofType(captureUserSelectedSecondDevice),
            flatMap(({ device }) => [
                // TODO: Add any behavior events needed here to identify user made a second radio choice
                setSecondDevice({ device }),
            ])
        )
    );

    captureUserSelectedUseCardOnFile$ = createEffect(() =>
        this._actions$.pipe(
            ofType(captureUserSelectedUseCardOnFile),
            flatMap(({ paymentInfo }) => [behaviorEventReactionForPaymentMethod({ paymentMethod: 'Card on File' }), setPaymentMethodToUseCardOnFile({ paymentInfo })])
        )
    );

    captureUserEnteredNewCard$ = createEffect(() =>
        this._actions$.pipe(
            ofType(captureUserEnteredNewCard),
            flatMap(({ paymentInfo }) => [behaviorEventReactionForPaymentMethod({ paymentMethod: 'New Card' }), setPaymentMethodToNewCard({ paymentInfo })])
        )
    );

    lookupStepRequested$ = createEffect(() =>
        this._actions$.pipe(
            ofType(lookupStepRequested),
            withLatestFrom(this._store.select(getIsCanadaMode)),
            map(([, isCanada]) => {
                if (isCanada) {
                    return setProvinceSelectionDisabled({ isDisabled: false });
                }
                return { type: 'noop' };
            })
        )
    );

    organicFirstStepFromRequested$ = createEffect(() =>
        this._actions$.pipe(
            ofType(organicFirstStepFromRequested),
            withLatestFrom(this._store.select(getIsCanadaMode)),
            map(([, isCanada]) => {
                if (isCanada) {
                    return setProvinceSelectionDisabled({ isDisabled: true });
                }
                return { type: 'noop' };
            })
        )
    );
}
