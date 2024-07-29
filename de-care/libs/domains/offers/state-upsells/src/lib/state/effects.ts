import { Injectable } from '@angular/core';
import { behaviorEventReactionForUpsells } from '@de-care/shared/state-behavior-events';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { flatMap } from 'rxjs/operators';
import { setUpsellOffers } from './actions';

@Injectable({ providedIn: 'root' })
export class Effects {
    constructor(private readonly _actions$: Actions) {}

    loadUpsellOfferInfoForUpsellOffers = createEffect(() =>
        this._actions$.pipe(
            ofType(setUpsellOffers),
            flatMap(({ upsellOffers }) => [behaviorEventReactionForUpsells({ upsellOffers })])
        )
    );
}
