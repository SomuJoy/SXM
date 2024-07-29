import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { behaviorEventImpressionForAccountSnapshotAlertDisplayed } from '@de-care/shared/state-behavior-events';
import { DataLayerService } from '../../data-layer.service';

@Injectable({ providedIn: 'root' })
export class ImpressionAccountSnapshotEffects {
    constructor(private readonly _actions$: Actions, private readonly _dataLayerService: DataLayerService) {}

    impressionForAccountSnapshotAlertDisplayed$ = createEffect(
        () =>
            this._actions$.pipe(
                ofType(behaviorEventImpressionForAccountSnapshotAlertDisplayed),
                tap(({ types }) => this._dataLayerService.eventTrack('account-snapshot-alert-displayed', { alertInfo: { alertTypes: types } }))
            ),
        { dispatch: false }
    );
}
