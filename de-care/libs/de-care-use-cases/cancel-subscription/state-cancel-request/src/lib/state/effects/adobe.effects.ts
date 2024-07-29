import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { setCancelInterstitialPageFlagAsUsed } from '../actions';
import { map } from 'rxjs/operators';
import { markAdobeFeatureFlagsByFlagNameAsConsumed } from '@de-care/shared/state-feature-flags';
import { AdobeFlagEnum } from '../../adobe-flag.enum';

@Injectable()
export class AdobeEffects {
    constructor(private actions$: Actions) {}

    setCancelInterstitialPageFlagAsUsed$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setCancelInterstitialPageFlagAsUsed),
            map(() => markAdobeFeatureFlagsByFlagNameAsConsumed({ flagNames: [AdobeFlagEnum.CancelInterstitial] }))
        )
    );
}
