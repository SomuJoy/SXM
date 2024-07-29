import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import { setQuote } from '../actions';
import { behaviorEventReactionQuoteRenewalSubscriptionActivationFee } from '@de-care/shared/state-behavior-events';
import { getRenewelQuoteActivationFee } from '../selectors';

@Injectable()
export class RenewalSubscriptionActivationFeeEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setQuote),
            withLatestFrom(this._store.pipe(select(getRenewelQuoteActivationFee))),
            filter(([_, fee]) => fee !== null),
            map(([_, fee]) => behaviorEventReactionQuoteRenewalSubscriptionActivationFee({ fee }))
        )
    );
}
