import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataLayerService } from '../../../data-layer.service';
import { behaviorEventReactionAppPlatform } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppEnvironmentEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effect$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionAppPlatform),
                tap(({ platform }) => {
                    this._dataLayerService.eventTrack('platform-detected', { appInfo: { platform } });
                })
            ),
        { dispatch: false }
    );
}
