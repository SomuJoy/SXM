import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionDeviceInfo } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionDeviceInfoEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effectDeviceInfo$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionDeviceInfo),
                tap(({ esn, vehicleInfo }) => this._dataLayerService.eventTrack('device-info', { deviceInfo: { esn, ...vehicleInfo } }))
            ),
        { dispatch: false }
    );
}
