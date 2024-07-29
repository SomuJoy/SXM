import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { AdobeTargetFlagsService } from '@de-care/shared/adobe-target-provider';
import { loadAdobeFeatureFlagsByFlagName, markAdobeFeatureFlagsByFlagNameAsConsumed } from './public.actions';
import { setAdobeFlags } from './actions';

@Injectable({
    providedIn: 'root',
})
export class AdobeEffects {
    constructor(private readonly _actions$: Actions, private readonly _adobeTargetFlagsService: AdobeTargetFlagsService) {}

    loadAdobeFlags$ = createEffect(() =>
        this._actions$.pipe(
            ofType(loadAdobeFeatureFlagsByFlagName),
            concatMap(({ flagNames }) => this._adobeTargetFlagsService.buildGetFlagsQuery(flagNames)),
            map((adobeFlags) => setAdobeFlags({ adobeFlags }))
        )
    );

    markAdobeFlagsAsConsumed$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(markAdobeFeatureFlagsByFlagNameAsConsumed),
                tap(({ flagNames }) => this._adobeTargetFlagsService.applyFlags(flagNames))
            ),
        { dispatch: false }
    );
}
