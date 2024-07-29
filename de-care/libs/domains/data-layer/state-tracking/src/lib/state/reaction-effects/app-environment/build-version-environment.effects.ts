import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionBuildVersion } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { LegacyDataLayerService } from '../../../legacy-data-layer.service';

@Injectable({ providedIn: 'root' })
export class BuildVersionEnvironmentEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: LegacyDataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionBuildVersion),
                tap(({ buildVersion }) => {
                    this._dataLayerService.eventTrack('meta', { buildVersion });
                })
            ),
        { dispatch: false }
    );
}
