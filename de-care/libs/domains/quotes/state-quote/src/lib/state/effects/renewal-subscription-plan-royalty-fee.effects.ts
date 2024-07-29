import { Injectable } from '@angular/core';
import { ofType, Actions, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { setQuote } from '../actions';
import { behaviorEventReactionQuoteRenewalSubscriptionRoyaltyFee } from '@de-care/shared/state-behavior-events';
import { getRenewelQuoteRoyaltyFee } from '../selectors';

@Injectable()
export class RenewalSubscriptionRoyaltyFeeEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setQuote),
            withLatestFrom(this._store.pipe(select(getRenewelQuoteRoyaltyFee))),
            map(([_, fee]) => behaviorEventReactionQuoteRenewalSubscriptionRoyaltyFee({ fee }))
        )
    );
}