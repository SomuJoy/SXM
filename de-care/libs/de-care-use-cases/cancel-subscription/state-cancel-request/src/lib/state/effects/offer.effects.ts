import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { setCancelInterstitialPageFlagAsUsed, setCancelInterstitialPageDisplayed } from '../actions';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class OfferEffects {
    constructor(private actions$: Actions, private _store: Store) {}

    cancelInterstitialPageDisplayed$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setCancelInterstitialPageDisplayed),
            map(() => setCancelInterstitialPageFlagAsUsed())
        )
    );
}
