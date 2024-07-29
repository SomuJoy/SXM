import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { setLegacyOfferInfoForOffers } from './public.actions';
import { setOfferInfoForOffers } from './actions';

/**
 * @deprecated Temporary action until we are 100% on CMS
 */
@Injectable({ providedIn: 'root' })
export class LegacyEffects {
    constructor(private readonly _actions$: Actions) {}

    loadOfferInfoForOffers = createEffect(() =>
        this._actions$.pipe(
            ofType(setLegacyOfferInfoForOffers),
            map(({ offersInfo }) => setOfferInfoForOffers({ offersInfo }))
        )
    );
}
