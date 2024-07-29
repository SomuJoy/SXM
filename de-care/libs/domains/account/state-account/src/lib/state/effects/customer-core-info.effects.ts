import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { getAccountAccountNumber, getAccountBillingStatus, getAccountEmail, getAccountFirstName, getAccountLastName, getAccountPhone } from '../selectors';
import { loadAccountError, setAccount } from '../actions';
import { behaviorEventErrorFromBusinessLogic, behaviorEventReactionCustomerCoreInfo, behaviorEventReactionForBillingStatus } from '@de-care/shared/state-behavior-events';

@Injectable()
export class CustomerCoreInfoEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            withLatestFrom(
                this._store.pipe(select(getAccountFirstName)),
                this._store.pipe(select(getAccountLastName)),
                this._store.pipe(select(getAccountEmail)),
                this._store.pipe(select(getAccountPhone)),
                this._store.pipe(select(getAccountAccountNumber))
            ),
            map(([_, firstName, lastName, email, phone, accountNumber]) => behaviorEventReactionCustomerCoreInfo({ firstName, lastName, email, phone, accountNumber }))
        )
    );

    billingStatusffects$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setAccount),
            withLatestFrom(this._store.pipe(select(getAccountBillingStatus))),
            map(([, billingStatus]) => billingStatus),
            map((billingStatus) => {
                return behaviorEventReactionForBillingStatus({ billingStatus });
            })
        )
    );

    loadAccountErrorEffect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadAccountError),
            map(({ error }) => {
                if (error?.errorCode === 'UNAUTHENTICATED_CUSTOMER') {
                    return behaviorEventErrorFromBusinessLogic({ message: 'Unauthenticated customer - session expired', errorCode: error?.errorCode });
                } else {
                    return behaviorEventErrorFromBusinessLogic({ message: 'Failed to load account data', errorCode: error?.errorCode });
                }
            })
        )
    );
}
