import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { setOffers } from '../actions/load-offers.actions';
import { getAllDataCapableOffersSummaryData, getAllOffersSummaryData } from '../selectors/offer.selectors';
import { behaviorEventReactionForOffers } from '@de-care/shared/state-behavior-events';

@Injectable()
export class OffersSummaryBehaviorEffects {
    constructor(private _actions$: Actions, private _store: Store) {}

    effect$ = createEffect(() =>
        this._actions$.pipe(
            ofType(setOffers),
            // TODO: This needs to get offers data from setOffers action payload and not the store select.
            withLatestFrom(this._store.pipe(select(getAllOffersSummaryData)), this._store.pipe(select(getAllDataCapableOffersSummaryData))),
            map(([_, audioPackages, dataPackages]) => behaviorEventReactionForOffers({ audioPackages, dataPackages }))
        )
    );
}
