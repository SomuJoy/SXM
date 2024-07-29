import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReaction10FootDeviceInfo } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class Reaction10FootDeviceInfoEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effectEligibilityCheck$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReaction10FootDeviceInfo),
                tap(({ deviceInfo: type }) => this._dataLayerService.eventTrack('passcode-validated', { deviceInfo: { type } }))
            ),
        { dispatch: false }
    );
}
