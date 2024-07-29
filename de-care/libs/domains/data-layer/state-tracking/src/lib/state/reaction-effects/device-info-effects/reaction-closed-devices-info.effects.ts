import { Actions, createEffect, ofType } from '@ngrx/effects';
import { behaviorEventReactionClosedDevicesInfo } from '@de-care/shared/state-behavior-events';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DataLayerService } from '../../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ReactionClosedDevicesInfoEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    effectClosedDevicesInfo$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventReactionClosedDevicesInfo),
                tap(({ closedDevices }) => this._dataLayerService.eventTrack('closed-devices-info', { closedDevices: closedDevices }))
            ),
        { dispatch: false }
    );
}
