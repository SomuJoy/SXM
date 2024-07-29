import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';
import { tap } from 'rxjs/operators';

import { behaviorEventReactionRTCProactiveOrganicAccountLookupCompleted } from '@de-care/shared/state-behavior-events';

@Injectable({ providedIn: 'root' })
export class RollToChoiceEffects {
    constructor(private readonly _actions$: Actions, private readonly _legacyDataLayerService: LegacyDataLayerService) {}

    authenticationSuccess$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionRTCProactiveOrganicAccountLookupCompleted),
                tap(({ componentName }) => {
                    this._legacyDataLayerService.explicitEventTrack('rtc-authentication-success', { componentName });
                })
            ),
        { dispatch: false }
    );
}
