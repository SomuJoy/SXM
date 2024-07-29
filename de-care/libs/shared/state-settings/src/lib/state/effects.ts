import { Injectable } from '@angular/core';
import { loadFeatureFlags } from '@de-care/shared/state-feature-flags';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { appSettingsLoaded } from './actions';

@Injectable({
    providedIn: 'root'
})
export class SettingsEffects {
    constructor(private readonly _actions$: Actions) {}

    setFeatureFlags$ = createEffect(() => {
        return this._actions$.pipe(
            ofType(appSettingsLoaded),
            map(action => loadFeatureFlags({ flags: action.settings.featureFlags }))
        );
    });
}
